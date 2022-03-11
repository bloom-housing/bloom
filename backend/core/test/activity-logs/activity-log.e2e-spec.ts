import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../../ormconfig.test")
import supertest from "supertest"
import { applicationSetup } from "../../src/app.module"
import { AuthModule } from "../../src/auth/auth.module"
import { setAuthorization } from "../utils/set-authorization-helper"
import { ActivityLogModule } from "../../src/activity-log/activity-log.module"
import { ActivityLog } from "../../src/activity-log/entities/activity-log.entity"
import { Repository } from "typeorm"
import { authzActions } from "../../src/auth/enum/authz-actions.enum"
import { Application } from "../../src/applications/entities/application.entity"
import { ApplicationsModule } from "../../src/applications/applications.module"
import { ThrottlerModule } from "@nestjs/throttler"
import { User } from "../../src/auth/entities/user.entity"
import { getTestAppBody } from "../lib/get-test-app-body"
import { ListingsModule } from "../../src/listings/listings.module"
import { Listing } from "../../src/listings/entities/listing.entity"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
jest.setTimeout(30000)

describe.skip("Programs", () => {
  let app: INestApplication
  let adminId: string
  let adminAccessToken: string
  let activityLogsRepository: Repository<ActivityLog>
  let applicationsRepository: Repository<Application>
  let listingsRepository: Repository<Listing>

  beforeAll(async () => {
    /* eslint-enable @typescript-eslint/no-empty-function */
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dbOptions),
        AuthModule,
        ActivityLogModule,
        ApplicationsModule,
        ThrottlerModule.forRoot({
          ttl: 60,
          limit: 2,
          ignoreUserAgents: [/^node-superagent.*$/],
        }),
        ListingsModule,
      ],
    }).compile()
    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()
    const res = await supertest(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "admin@example.com", password: "abcdef" })
      .expect(201)
    adminAccessToken = res.body.accessToken
    const userRepository = app.get<Repository<User>>(getRepositoryToken(User))
    adminId = (await userRepository.findOne({ email: "admin@example.com" })).id
    activityLogsRepository = app.get<Repository<ActivityLog>>(getRepositoryToken(ActivityLog))
    applicationsRepository = app.get<Repository<Application>>(getRepositoryToken(Application))
    listingsRepository = app.get<Repository<Listing>>(getRepositoryToken(Listing))

    const listingsRes = await supertest(app.getHttpServer())
      .get("/listings?limit=all&view=full")
      .expect(200)
    const appBody = getTestAppBody(listingsRes.body.items[0].id)
    await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(appBody)
      .set("jurisdictionName", "Alameda")
      .set(...setAuthorization(adminAccessToken))
  })

  beforeEach(async () => {
    await activityLogsRepository.createQueryBuilder().delete().execute()
  })

  it(`should capture application edit`, async () => {
    const testApplication = (
      await applicationsRepository.find({ take: 1, relations: ["listing"] })
    )[0]
    await supertest(app.getHttpServer())
      .put(`/applications/${testApplication.id}`)
      .set(...setAuthorization(adminAccessToken))
      .send(testApplication)
      .expect(200)
    const activityLogs = await activityLogsRepository.find({ relations: ["user"] })
    expect(activityLogs.length).toBe(1)
    expect(activityLogs[0].recordId).toBe(testApplication.id)
    expect(activityLogs[0].user.id).toBe(adminId)
    expect(activityLogs[0].action).toBe(authzActions.update)
    expect(activityLogs[0].module).toBe("application")
    expect(activityLogs[0].metadata).toBe(null)
  })

  it(`should not capture application edit that failed`, async () => {
    const testApplication = (
      await applicationsRepository.find({ take: 1, relations: ["listing"] })
    )[0]
    await supertest(app.getHttpServer())
      .put(`/applications/${testApplication.id}`)
      .send({
        ...testApplication,
        listing: null,
      })
      .set(...setAuthorization(adminAccessToken))
      .expect(400)
    const activityLogs = await activityLogsRepository.find({ relations: ["user"] })
    expect(activityLogs.length).toBe(0)
  })

  it(`should capture listing status as activity log metadata`, async () => {
    const testListing = (await listingsRepository.find({ take: 1 }))[0]

    const listingGetRes = await supertest(app.getHttpServer())
      .get(`/listings/${testListing.id}`)
      .expect(200)

    await supertest(app.getHttpServer())
      .put(`/listings/${testListing.id}`)
      .send({
        ...listingGetRes.body,
      })
      .set(...setAuthorization(adminAccessToken))
      .expect(200)

    const activityLogs = await activityLogsRepository.find({ relations: ["user"] })
    expect(activityLogs.length).toBe(1)
    expect(activityLogs[0].recordId).toBe(testListing.id)
    expect(activityLogs[0].user.id).toBe(adminId)
    expect(activityLogs[0].action).toBe(authzActions.update)
    expect(activityLogs[0].module).toBe("listing")
    expect(activityLogs[0].metadata).toStrictEqual({ status: listingGetRes.body.status })
  })

  afterAll(async () => {
    await app.close()
  })
})
