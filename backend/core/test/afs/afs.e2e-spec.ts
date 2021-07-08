import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm"
import supertest from "supertest"
import { applicationSetup } from "../../src/app.module"
import { AuthModule } from "../../src/auth/auth.module"
import { ApplicationsModule } from "../../src/applications/applications.module"
import { ListingsModule } from "../../src/listings/listings.module"
import { EmailService } from "../../src/shared/email/email.service"
import { getUserAccessToken } from "../utils/get-user-access-token"
import { setAuthorization } from "../utils/set-authorization-helper"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../../ormconfig.test")
import { Repository } from "typeorm"
import { Application } from "../../src/applications/entities/application.entity"
import { HouseholdMember } from "../../src/applications/entities/household-member.entity"
import { ThrottlerModule } from "@nestjs/throttler"
import { ApplicationFlaggedSet } from "../../src/application-flagged-sets/entities/application-flagged-set.entity"
import { getTestAppBody } from "../lib/get-test-app-body"
import { FlaggedSetStatus } from "../../src/application-flagged-sets/types/flagged-set-status-enum"
import { Rule } from "../../src/application-flagged-sets/types/rule-enum"

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

  const setupDb = async () => {
    await householdMembersRepository.createQueryBuilder().delete().execute()
    await applicationsRepository.createQueryBuilder().delete().execute()
    await afsRepository.createQueryBuilder().delete().execute()
  }

  beforeAll(async () => {
    /* eslint-disable @typescript-eslint/no-empty-function */
    const testEmailService = {
      confirmation: async () => {},
    }
    /* eslint-enable @typescript-eslint/no-empty-function */
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dbOptions),
        AuthModule,
        ListingsModule,
        ApplicationsModule,
        TypeOrmModule.forFeature([ApplicationFlaggedSet, Application, HouseholdMember]),
        ThrottlerModule.forRoot({
          ttl: 60,
          limit: 5,
          ignoreUserAgents: [/^node-superagent.*$/],
        }),
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
    listing1Id = listings.body.items[0].id
    await setupDb()
  })

  it(`should mark two similar application as flagged`, async () => {
    function checkAppsInAfsForRule(afsResponse, apps, rule) {
      const afsesForRule = afsResponse.body.items.filter((item) => item.rule === rule)
      expect(afsesForRule.length).toBe(1)
      expect(afsesForRule[0].status).toBe(FlaggedSetStatus.flagged)
      for (const appId of apps.map((app) => app.body.id)) {
        expect(afsesForRule[0].applications.map((app) => app.id).includes(appId)).toBe(true)
      }
      expect(afsesForRule[0].applications.length).toBe(apps.length)
    }

    const appContent = getTestAppBody(listing1Id)
    const apps = []
    await Promise.all(
      [appContent, appContent].map(async (payload) => {
        const appRes = await supertest(app.getHttpServer())
          .post("/applications/submit")
          .send(payload)
          .expect(201)
        apps.push(appRes)
      })
    )

    let afses = await supertest(app.getHttpServer())
      .get(`/applicationFlaggedSets?listingId=${listing1Id}`)
      .set(...setAuthorization(adminAccessToken))

    expect(Array.isArray(afses.body.items)).toBe(true)
    expect(afses.body.items.length).toBe(2)

    checkAppsInAfsForRule(afses, apps, Rule.nameAndDOB)
    checkAppsInAfsForRule(afses, apps, Rule.email)

    const app3 = await supertest(app.getHttpServer())
      .post("/applications/submit")
      .send(appContent)
      .expect(201)

    apps.push(app3)

    afses = await supertest(app.getHttpServer())
      .get(`/applicationFlaggedSets?listingId=${listing1Id}`)
      .set(...setAuthorization(adminAccessToken))

    expect(Array.isArray(afses.body.items)).toBe(true)
    expect(afses.body.items.length).toBe(2)

    checkAppsInAfsForRule(afses, apps, Rule.nameAndDOB)
    checkAppsInAfsForRule(afses, apps, Rule.email)
  })

  it(`should resolve an application flagged set`, async () => {
    const appContent1 = getTestAppBody(listing1Id)
    const appContent2 = getTestAppBody(listing1Id)

    appContent2.applicant.emailAddress = "another@email.com"
    const apps = []

    await Promise.all(
      [appContent1, appContent2].map(async (payload) => {
        const appRes = await supertest(app.getHttpServer())
          .post("/applications/submit")
          .send(payload)
          .expect(201)
        apps.push(appRes)
      })
    )

    let afses = await supertest(app.getHttpServer())
      .get(`/applicationFlaggedSets?listingId=${listing1Id}`)
      .set(...setAuthorization(adminAccessToken))

    expect(afses.body.meta.totalFlagged).toBe(1)

    let resolveRes = await supertest(app.getHttpServer())
      .post(`/applicationFlaggedSets/resolve`)
      .send({ afsId: afses.body.items[0].id, applications: [{ id: apps[0].body.id }] })
      .set(...setAuthorization(adminAccessToken))
      .expect(201)

    afses = await supertest(app.getHttpServer())
      .get(`/applicationFlaggedSets?listingId=${listing1Id}`)
      .set(...setAuthorization(adminAccessToken))

    expect(afses.body.meta.totalFlagged).toBe(0)

    let resolvedAfs = resolveRes.body
    expect(resolvedAfs.status).toBe(FlaggedSetStatus.resolved)
    expect(resolvedAfs.applications.filter((app) => app.markedAsDuplicate === true).length).toBe(1)
    expect(resolvedAfs.applications.filter((app) => app.markedAsDuplicate === false).length).toBe(1)

    resolveRes = await supertest(app.getHttpServer())
      .post(`/applicationFlaggedSets/resolve`)
      .send({ afsId: afses.body.items[0].id, applications: [{ id: apps[1].body.id }] })
      .set(...setAuthorization(adminAccessToken))
      .expect(201)

    resolvedAfs = resolveRes.body
    expect(resolvedAfs.status).toBe(FlaggedSetStatus.resolved)
    expect(resolvedAfs.applications.filter((app) => app.markedAsDuplicate === true).length).toBe(1)
    expect(resolvedAfs.applications.filter((app) => app.markedAsDuplicate === false).length).toBe(1)
  })

  afterEach(async () => {
    await setupDb()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
