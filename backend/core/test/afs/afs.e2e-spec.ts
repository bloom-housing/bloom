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
import { Application, ApplicationStatus } from "../../src/applications/entities/application.entity"
import { HouseholdMember } from "../../src/applications/entities/household-member.entity"
import { ApplicationFlaggedSet } from "../../src/application-flagged-sets/entities/application-flagged-set.entity"
import { getTestAppBody } from "../lib/get-test-app-body"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
jest.setTimeout(30000)

describe("Applications", () => {
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

  // it(`should mark two similar application as flagged`, async () => {
  //   const appContent = getTestAppBody(listing1Id)
  //   const app1 = await supertest(app.getHttpServer())
  //     .post("/applications/submit")
  //     .send(appContent)
  //     .expect(201)
  //   appContent.applicant.emailAddress = "another@email.com"
  //   const app2 = await supertest(app.getHttpServer())
  //     .post("/applications/submit")
  //     .send(appContent)
  //     .expect(201)
  //   const afses = await supertest(app.getHttpServer())
  //     .get("/applicationFlaggedSets")
  //     .set(...setAuthorization(adminAccessToken))
  //   expect(Array.isArray(afses.body.items)).toBe(true)
  //   expect(afses.body.items.length).toBe(1)
  //   expect(afses.body.items[0].rule).toBe(Rule.nameAndDOB)
  //   expect(afses.body.items[0].applications.map((app) => app.id).includes(app1.body.id))
  //   expect(afses.body.items[0].applications.map((app) => app.id).includes(app2.body.id))
  // })

  it(`resolve should mark application as duplicate, move it to resolvedApplications in every AFS it exists`, async () => {
    const appContent = getTestAppBody(listing1Id)
    appContent.applicant.emailAddress = "test@exygy.dev"
    const [app1, app2, app3] = await Promise.all(
      [appContent, appContent, appContent].map(async (appContent) => {
        const res = await supertest(app.getHttpServer())
          .post("/applications/submit")
          .send(appContent)
          .expect(201)
        return res.body
      })
    )
    const afses = await supertest(app.getHttpServer())
      .get("/applicationFlaggedSets")
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    expect(Array.isArray(afses.body.items)).toBe(true)
    expect(afses.body.items.length).toBe(2)
    let [afsToBeResolved, otherAfs] = afses.body.items
    expect(afsToBeResolved.applications.length).toBe(3)
    expect(afsToBeResolved.resolvedApplications.length).toBe(0)
    expect(otherAfs.applications.length).toBe(3)
    expect(otherAfs.resolvedApplications.length).toBe(0)
    const app1Id = app1.body.id
    await supertest(app.getHttpServer())
      .post("/applicationFlaggedSets")
      .send({
        afsId: afsToBeResolved.id,
        applicationIds: [{ id: app1Id }],
      })
      .set(...setAuthorization(adminAccessToken))
      .expect(201)
    const updatedAfses = (
      await supertest(app.getHttpServer())
        .get(`/applicationFlaggedSets`)
        .set(...setAuthorization(adminAccessToken))
        .expect(200)
    ).body.items

    const resolvedAfs = updatedAfses.filter((afs) => afs.id === afsToBeResolved.id)[0]
    expect(resolvedAfs.resolved).toBe(true)
    expect(resolvedAfs.resolvingUserId).not.toBe(undefined)
    expect(resolvedAfs.resolvedTime).not.toBe(undefined)
    expect(resolvedAfs.applications.length).toBe(2)
    expect(resolvedAfs.applications.map((app) => app.id).includes(app1Id)).not.toBe(true)
    expect(resolvedAfs.resolvedApplications.length).toBe(1)
    expect(resolvedAfs.resolvedApplications.map((app) => app.id).includes(app1Id)).toBe(true)
    expect(resolvedAfs.resolvedApplications[0].status).toBe(ApplicationStatus.duplicate)

    otherAfs = updatedAfses.filter((afs) => afs.id === otherAfs.id)[0]
    expect(otherAfs.applications.length).toBe(2)
    expect(otherAfs.applications.map((app) => app.id).includes(app1Id)).not.toBe(true)
    expect(otherAfs.resolvedApplications.length).toBe(1)
    expect(otherAfs.resolvedApplications.map((app) => app.id).includes(app1Id)).toBe(true)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
