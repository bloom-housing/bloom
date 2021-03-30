import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm"
import supertest from "supertest"
import { applicationSetup } from "../../src/app.module"
import { AuthModule } from "../../src/auth/auth.module"
import { ApplicationsModule } from "../../src/applications/applications.module"
import { ListingsModule } from "../../src/listings/listings.module"
import { EmailService } from "../../src/shared/email.service"
import { getUserAccessToken } from "../utils/get-user-access-token"
import { setAuthorization } from "../utils/set-authorization-helper"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../../ormconfig.test")
import { Repository } from "typeorm"
import { Application } from "../../src/applications/entities/application.entity"
import { HouseholdMember } from "../../src/applications/entities/household-member.entity"
import {
  ApplicationFlaggedSet,
  Rule,
} from "../../src/application-flagged-sets/entities/application-flagged-set.entity"
import { getTestAppBody } from "../lib/get-test-app-body"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
jest.setTimeout(30000)

describe("ApplicationFlaggedSets", () => {
  let app: INestApplication
  let adminAccessToken: string
  let applicationsRepository: Repository<Application>
  let afsRepository: Repository<ApplicationFlaggedSet>
  let householdMembersRepository: Repository<HouseholdMember>
  let listing1Id: string

  beforeAll(async () => {
    /* eslint-disable @typescript-eslint/no-empty-function */
    const testEmailService = { confirmation: async () => {} }
    /* eslint-enable @typescript-eslint/no-empty-function */
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dbOptions),
        AuthModule,
        ListingsModule,
        ApplicationsModule,
        TypeOrmModule.forFeature([ApplicationFlaggedSet, Application, HouseholdMember]),
      ],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile()
    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()
    applicationsRepository = app.get<Repository<Application>>(getRepositoryToken(Application))
    afsRepository = app.get<Repository<ApplicationFlaggedSet>>(
      getRepositoryToken(ApplicationFlaggedSet)
    )
    householdMembersRepository = app.get<Repository<HouseholdMember>>(
      getRepositoryToken(HouseholdMember)
    )

    adminAccessToken = await getUserAccessToken(app, "admin@example.com", "abcdef")
    const listings = await supertest(app.getHttpServer()).get("/listings").expect(200)
    listing1Id = listings.body[0].id
  })

  beforeEach(async () => {
    await householdMembersRepository.createQueryBuilder().delete().execute()
    await applicationsRepository.createQueryBuilder().delete().execute()
    await afsRepository.createQueryBuilder().delete().execute()
  })

  it(`should mark two similar application as flagged`, async () => {
    const appContent = getTestAppBody(listing1Id)

    const app1 = await supertest(app.getHttpServer())
      .post("/applications/submit")
      .send(appContent)
      .expect(201)

    const app2 = await supertest(app.getHttpServer())
      .post("/applications/submit")
      .send(appContent)
      .expect(201)

    const app3 = await supertest(app.getHttpServer())
      .post("/applications/submit")
      .send(appContent)
      .expect(201)

    await new Promise((r) => setTimeout(r, 1000))

    const afses = await supertest(app.getHttpServer())
      .get(`/applicationFlaggedSets?listingId=${listing1Id}`)
      .set(...setAuthorization(adminAccessToken))

    expect(Array.isArray(afses.body.items)).toBe(true)
    expect(afses.body.items.length).toBe(2)

    const afsesForNameAndDob = afses.body.items.filter((item) => item.rule === Rule.nameAndDOB)
    expect(afsesForNameAndDob.length).toBe(1)

    for (const appId of [app1, app2, app3].map((app) => app.body.id)) {
      expect(afsesForNameAndDob[0].applications.map((app) => app.id).includes(appId)).toBe(true)
    }
    expect(afsesForNameAndDob[0].applications.length).toBe(3)

    const afsesForEmail = afses.body.items.filter((item) => item.rule === Rule.email)
    expect(afsesForEmail.length).toBe(1)
    for (const appId of [app1, app2, app3].map((app) => app.body.id)) {
      expect(afsesForEmail[0].applications.map((app) => app.id).includes(appId)).toBe(true)
    }
    expect(afsesForEmail[0].applications.length).toBe(3)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
