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
import { ApplicationDto } from "../../src/applications/dto/application.dto"
import { Listing } from "../../src/listings/entities/listing.entity"
import { ListingStatus } from "../../src/listings/types/listing-status-enum"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions from "../../ormconfig.test"
import { EmailService } from "../../src/email/email.service"
import { ApplicationFlaggedSetsCronjobService } from "../../src/application-flagged-sets/application-flagged-sets-cronjob.service"
import { ListingRepository } from "../../src/listings/db/listing.repository"

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
  let afsProcessingService: ApplicationFlaggedSetsCronjobService
  let listing1Id: string
  let updateApplication
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
        TypeOrmModule.forFeature([
          ApplicationFlaggedSet,
          Application,
          HouseholdMember,
          Listing,
          ListingRepository,
        ]),
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

    getAfsesForListingId = async (listingId) => {
      return (
        await supertest(app.getHttpServer())
          .get(`/applicationFlaggedSets?listingId=${listingId}`)
          .set(...setAuthorization(adminAccessToken))
          .expect(200)
      ).body
    }

    afsProcessingService = app.get<ApplicationFlaggedSetsCronjobService>(
      ApplicationFlaggedSetsCronjobService
    )
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

    await afsProcessingService.process()

    let afses = await getAfsesForListingId(listing1Id)

    expect(afses.meta.totalFlagged).toBe(0)
    expect(afses.items.length).toBe(0)

    const [app1, app2] = apps

    // Applications conflict by email rule
    app2.applicant.emailAddress = app1Seed.applicant.emailAddress
    await updateApplication(app2)

    await afsProcessingService.process()

    afses = await getAfsesForListingId(listing1Id)

    expect(afses.meta.totalFlagged).toBe(1)
    expect(afses.items[0].applications.map((app) => app.id).includes(app1.id)).toBe(true)
    expect(afses.items[0].applications.map((app) => app.id).includes(app2.id)).toBe(true)

    // Applications do not conflict by any rule
    app2.applicant.emailAddress = app2Seed.applicant.emailAddress
    await updateApplication(app2)

    await afsProcessingService.process()

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

    await afsProcessingService.process()

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

    await afsProcessingService.process()

    afses = await getAfsesForListingId(listing1Id)

    expect(afses.meta.totalFlagged).toBe(1)
    expect(afses.items[0].applications.map((app) => app.id).includes(app1.id)).toBe(true)
    expect(afses.items[0].applications.map((app) => app.id).includes(app2.id)).toBe(true)
    expect(afses.items[0].applications.map((app) => app.id).includes(app3.id)).toBe(true)

    // Application 3 do not conflict with others now
    app3.applicant.emailAddress = app3Seed.applicant.emailAddress
    app3 = await updateApplication(app3)

    await afsProcessingService.process()

    afses = await getAfsesForListingId(listing1Id)

    expect(afses.meta.totalFlagged).toBe(1)
    expect(afses.items.length).toBe(1)
    expect(afses.items[0].applications.map((app) => app.id).includes(app3.id)).toBe(false)
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
