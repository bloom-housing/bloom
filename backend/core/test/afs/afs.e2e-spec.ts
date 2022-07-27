import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm"
import supertest from "supertest"
import { applicationSetup } from "../../src/app.module"
import { AuthModule } from "../../src/auth/auth.module"
import { ApplicationsModule } from "../../src/applications/applications.module"
import { ListingsModule } from "../../src/listings/listings.module"
import { getUserAccessToken } from "../utils/get-user-access-token"
import { setAuthorization } from "../utils/set-authorization-helper"
import { Repository } from "typeorm"
import { Application } from "../../src/applications/entities/application.entity"
import { HouseholdMember } from "../../src/applications/entities/household-member.entity"
import { ThrottlerModule } from "@nestjs/throttler"
import { ApplicationFlaggedSet } from "../../src/application-flagged-sets/entities/application-flagged-set.entity"
import { getTestAppBody } from "../lib/get-test-app-body"
import { FlaggedSetStatus } from "../../src/application-flagged-sets/types/flagged-set-status-enum"
import { Rule } from "../../src/application-flagged-sets/types/rule-enum"
import { ApplicationDto } from "../../src/applications/dto/application.dto"
import { Listing } from "../../src/listings/entities/listing.entity"
import { ListingStatus } from "../../src/listings/types/listing-status-enum"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions from "../../ormconfig.test"
import { EmailService } from "../../src/email/email.service"

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
  let listingsRepository: Repository<Listing>
  let listing1Id: string
  let updateApplication
  let getApplication
  let getAfsesForListingId

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
        TypeOrmModule.forFeature([ApplicationFlaggedSet, Application, HouseholdMember, Listing]),
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
    listingsRepository = app.get<Repository<Listing>>(getRepositoryToken(Listing))
    const listing = (await listingsRepository.find({ take: 1 }))[0]
    await listingsRepository.save({
      ...listing,
      status: ListingStatus.closed,
    })

    adminAccessToken = await getUserAccessToken(app, "admin@example.com", "abcdef")
    listing1Id = listing.id
    await setupDb()

    updateApplication = async (application: ApplicationDto) => {
      return (
        await supertest(app.getHttpServer())
          .put(`/applications/${application.id}`)
          .send(application)
          .set(...setAuthorization(adminAccessToken))
          .expect(200)
      ).body
    }

    getApplication = async (id: string) => {
      return (
        await supertest(app.getHttpServer())
          .get(`/applications/${id}`)
          .set(...setAuthorization(adminAccessToken))
          .expect(200)
      ).body
    }

    getAfsesForListingId = async (listingId) => {
      return (
        await supertest(app.getHttpServer())
          .get(`/applicationFlaggedSets?listingId=${listingId}`)
          .set(...setAuthorization(adminAccessToken))
          .expect(200)
      ).body
    }
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

  it(`should take application edits into account (application toggles between conflicting and non conflicting in an AFS of 2 apps)`, async () => {
    const app1Seed = getTestAppBody(listing1Id)
    const app2Seed = getTestAppBody(listing1Id)

    // Two applications do not conflict by any rule at this point
    app2Seed.applicant.emailAddress = "another@email.com"
    app2Seed.applicant.firstName = "AnotherFirstName"
    const apps = []

    for (const payload of [app1Seed, app2Seed]) {
      const appRes = await supertest(app.getHttpServer())
        .post("/applications/submit")
        .send(payload)
        .expect(201)
      apps.push(appRes.body)
    }

    let afses = await getAfsesForListingId(listing1Id)

    expect(afses.meta.totalFlagged).toBe(0)
    expect(afses.items.length).toBe(0)

    const [app1, app2] = apps

    // Applications conflict by email rule
    app2.applicant.emailAddress = app1Seed.applicant.emailAddress
    await updateApplication(app2)

    afses = await getAfsesForListingId(listing1Id)

    expect(afses.meta.totalFlagged).toBe(1)
    expect(afses.items[0].applications.map((app) => app.id).includes(app1.id)).toBe(true)
    expect(afses.items[0].applications.map((app) => app.id).includes(app2.id)).toBe(true)

    // Applications do not conflict by any rule
    app2.applicant.emailAddress = app2Seed.applicant.emailAddress
    await updateApplication(app2)

    afses = await getAfsesForListingId(listing1Id)

    expect(afses.meta.totalFlagged).toBe(0)
    expect(afses.items.length).toBe(0)
  })

  it(`should take application edits into account (application toggles between conflicting and non conflicting in an AFS of 3 apps)`, async () => {
    const app1Seed = getTestAppBody(listing1Id)
    const app2Seed = getTestAppBody(listing1Id)
    const app3Seed = getTestAppBody(listing1Id)

    // Three applications do not conflict by any rule at this point
    app2Seed.applicant.emailAddress = "another@email.com"
    app2Seed.applicant.firstName = "AnotherFirstName"
    app3Seed.applicant.emailAddress = "third@email.com"
    app3Seed.applicant.firstName = "ThirdFirstName"
    const apps = []

    for (const payload of [app1Seed, app2Seed, app3Seed]) {
      const appRes = await supertest(app.getHttpServer())
        .post("/applications/submit")
        .send(payload)
        .expect(201)
      apps.push(appRes.body)
    }

    let afses = await getAfsesForListingId(listing1Id)

    expect(afses.meta.totalFlagged).toBe(0)
    expect(afses.items.length).toBe(0)

    // eslint-disable-next-line
    let [app1, app2, app3] = apps

    // Applications conflict by email rule
    app2.applicant.emailAddress = app1Seed.applicant.emailAddress
    app3.applicant.emailAddress = app1Seed.applicant.emailAddress
    await updateApplication(app2)
    app3 = await updateApplication(app3)

    afses = await getAfsesForListingId(listing1Id)

    expect(afses.meta.totalFlagged).toBe(1)
    expect(afses.items[0].applications.map((app) => app.id).includes(app1.id)).toBe(true)
    expect(afses.items[0].applications.map((app) => app.id).includes(app2.id)).toBe(true)
    expect(afses.items[0].applications.map((app) => app.id).includes(app3.id)).toBe(true)

    // Application 3 do not conflict with others now
    app3.applicant.emailAddress = app3Seed.applicant.emailAddress
    app3 = await updateApplication(app3)

    afses = await getAfsesForListingId(listing1Id)

    expect(afses.meta.totalFlagged).toBe(1)
    expect(afses.items.length).toBe(1)
    expect(afses.items[0].applications.map((app) => app.id).includes(app3.id)).toBe(false)
  })

  it(`should take application edits into account (application toggles between conflicting and non conflicting in an AFS of 3 apps, AFS already resolved)`, async () => {
    const app1Seed = getTestAppBody(listing1Id)
    const app2Seed = getTestAppBody(listing1Id)
    const app3Seed = getTestAppBody(listing1Id)

    // Three applications conflict by email rule
    app2Seed.applicant.firstName = "AnotherFirstName"
    app3Seed.applicant.firstName = "ThirdFirstName"
    const apps = []

    for (const payload of [app1Seed, app2Seed, app3Seed]) {
      const appRes = await supertest(app.getHttpServer())
        .post("/applications/submit")
        .send(payload)
        .expect(201)
      apps.push(appRes.body)
    }

    // eslint-disable-next-line
    let [app1, app2, app3] = apps
    expect(app3.markedAsDuplicate).toBe(false)

    const afses = await getAfsesForListingId(listing1Id)
    const afsToBeResolved = afses.items[0]

    const resolveRes = await supertest(app.getHttpServer())
      .post(`/applicationFlaggedSets/resolve`)
      .send({ afsId: afsToBeResolved.id, applications: [{ id: app3.id }] })
      .set(...setAuthorization(adminAccessToken))
      .expect(201)
    expect(resolveRes.body.resolvedTime).not.toBe(null)
    expect(resolveRes.body.resolvingUser).not.toBe(null)
    expect(resolveRes.body.status).toBe(FlaggedSetStatus.resolved)

    app3 = await getApplication(app3.id)
    expect(app3.markedAsDuplicate).toBe(true)

    // App3 now does not conflict with any other applications
    app3.applicant.emailAddress = "third@email.com"
    app3 = await updateApplication(app3)
    expect(app3.markedAsDuplicate).toBe(false)

    const previouslyResolvedAfs = (
      await supertest(app.getHttpServer())
        .get(`/applicationFlaggedSets/${afsToBeResolved.id}`)
        .set(...setAuthorization(adminAccessToken))
        .expect(200)
    ).body
    expect(previouslyResolvedAfs.resolvedTime).toBe(null)
    expect(previouslyResolvedAfs.resolvingUser).toBe(null)
    expect(previouslyResolvedAfs.status).toBe(FlaggedSetStatus.flagged)
    expect(previouslyResolvedAfs.applications.map((app) => app.id).includes(app1.id)).toBe(true)
    expect(previouslyResolvedAfs.applications.map((app) => app.id).includes(app2.id)).toBe(true)
    expect(previouslyResolvedAfs.applications.map((app) => app.id).includes(app3.id)).toBe(false)
  })

  afterEach(async () => {
    await setupDb()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    const modifiedListing = await listingsRepository.findOne({ id: listing1Id })
    await listingsRepository.save({
      ...modifiedListing,
      status: ListingStatus.active,
    })
    await app.close()
  })
})
