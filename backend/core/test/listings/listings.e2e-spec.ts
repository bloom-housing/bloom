import { Test } from "@nestjs/testing"
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm"
import supertest from "supertest"
import { ListingsModule } from "../../src/listings/listings.module"
import { applicationSetup } from "../../src/app.module"
import { ListingDto } from "../../src/listings/dto/listing.dto"
import { getUserAccessToken } from "../utils/get-user-access-token"
import { setAuthorization } from "../utils/set-authorization-helper"
import { AssetCreateDto } from "../../src/assets/dto/asset.dto"
import { ApplicationMethodCreateDto } from "../../src/application-methods/dto/application-method.dto"
import { ApplicationMethodType } from "../../src/application-methods/types/application-method-type-enum"
import { ApplicationSection, Language } from "../../types"
import { AssetsModule } from "../../src/assets/assets.module"
import { ApplicationMethodsModule } from "../../src/application-methods/applications-methods.module"
import { PaperApplicationsModule } from "../../src/paper-applications/paper-applications.module"
import { ListingEventCreateDto } from "../../src/listings/dto/listing-event.dto"
import { ListingEventType } from "../../src/listings/types/listing-event-type-enum"
import { Listing } from "../../src/listings/entities/listing.entity"
import { ListingStatus } from "../../src/listings/types/listing-status-enum"
import qs from "qs"
import { ListingUpdateDto } from "../../src/listings/dto/listing-update.dto"
import { MultiselectQuestion } from "../../src//multiselect-question/entities/multiselect-question.entity"
import { Repository } from "typeorm"
import { INestApplication } from "@nestjs/common"
import { Jurisdiction } from "../../src/jurisdictions/entities/jurisdiction.entity"
import { makeTestListing } from "../utils/make-test-listing"

// eslint-disable-next-line @typescript-eslint/no-var-requires
import dbOptions from "../../ormconfig.test"
import { MultiselectQuestionDto } from "../../src/multiselect-question/dto/multiselect-question.dto"

import cookieParser from "cookie-parser"
import { EmailService } from "../../src/email/email.service"
import { User } from "../../src/auth/entities/user.entity"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
jest.setTimeout(30000)

describe("Listings", () => {
  let app: INestApplication
  let questionRepository: Repository<MultiselectQuestion>
  let adminAccessToken: string
  let jurisdictionsRepository: Repository<Jurisdiction>
  let userRepository: Repository<User>

  const testEmailService = {
    /* eslint-disable @typescript-eslint/no-empty-function */
    requestApproval: async () => {},
    changesRequested: async () => {},
    listingApproved: async () => {},
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dbOptions),
        TypeOrmModule.forFeature([Jurisdiction, MultiselectQuestion]),
        ListingsModule,
        AssetsModule,
        ApplicationMethodsModule,
        PaperApplicationsModule,
      ],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile()

    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    app.use(cookieParser())
    await app.init()
    questionRepository = app.get<Repository<MultiselectQuestion>>(
      getRepositoryToken(MultiselectQuestion)
    )
    adminAccessToken = await getUserAccessToken(app, "admin@example.com", "abcdef")
    jurisdictionsRepository = moduleRef.get<Repository<Jurisdiction>>(
      getRepositoryToken(Jurisdiction)
    )
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User))
  })

  it("should return all listings", async () => {
    const res = await supertest(app.getHttpServer()).get("/listings").expect(200)
    expect(res.body.items.map((listing) => listing.id).length).toBeGreaterThan(0)
  })

  it("should return the first page of paginated listings", async () => {
    // Make the limit 1 less than the full number of listings, so that the first page contains all
    // but the last listing.
    const page = "1"
    // This is the number of listings in ../../src/seed.ts minus 1
    const limit = 15
    const params = "/?page=" + page + "&limit=" + limit.toString()
    const res = await supertest(app.getHttpServer())
      .get("/listings" + params)
      .expect(200)
    expect(res.body.items.length).toEqual(limit)
  })

  it("should return the last page of paginated listings", async () => {
    // Make the limit 1 less than the full number of listings, so that the second page contains
    // only one listing.
    // query to get max number of listings
    let queryParams = {
      limit: 1,
      page: 1,
      view: "base",
    }
    let query = qs.stringify(queryParams)
    let res = await supertest(app.getHttpServer()).get(`/listings?${query}`).expect(200)
    const totalItems = res.body.meta.totalItems

    queryParams = {
      limit: totalItems - 1,
      page: 2,
      view: "base",
    }
    query = qs.stringify(queryParams)
    res = await supertest(app.getHttpServer()).get(`/listings?${query}`).expect(200)
    expect(res.body.items.length).toEqual(1)
  })

  it("should return listings with matching zipcodes", async () => {
    const queryParams = {
      limit: "all",
      filter: [
        {
          $comparison: "IN",
          zipcode: "94621,94404",
        },
      ],
      view: "base",
    }
    const query = qs.stringify(queryParams)
    await supertest(app.getHttpServer()).get(`/listings?${query}`).expect(200)
  })

  it("should return listings with matching Alameda jurisdiction", async () => {
    const jurisdictions = await jurisdictionsRepository.find()
    const alameda = jurisdictions.find((jurisdiction) => jurisdiction.name === "Alameda")
    const queryParams = {
      limit: "all",
      filter: [
        {
          $comparison: "=",
          jurisdiction: alameda.id,
        },
      ],
      view: "base",
    }
    const query = qs.stringify(queryParams)
    const res = await supertest(app.getHttpServer()).get(`/listings?${query}`).expect(200)
    expect(res.body.items.length).toBe(16)
  })

  it("should return listings with matching San Jose jurisdiction", async () => {
    const jurisdictions = await jurisdictionsRepository.find()
    const sanjose = jurisdictions.find((jurisdiction) => jurisdiction.name === "San Jose")
    const queryParams = {
      limit: "all",
      filter: [
        {
          $comparison: "=",
          jurisdiction: sanjose.id,
        },
      ],
      view: "base",
    }
    const query = qs.stringify(queryParams)
    const res = await supertest(app.getHttpServer()).get(`/listings?${query}`).expect(200)
    expect(res.body.items.length).toBe(1)
  })

  it("should return no listings with San Mateo jurisdiction", async () => {
    const jurisdictions = await jurisdictionsRepository.find()
    const sanmateo = jurisdictions.find((jurisdiction) => jurisdiction.name === "San Mateo")
    const queryParams = {
      limit: "all",
      filter: [
        {
          $comparison: "=",
          jurisdiction: sanmateo.id,
        },
      ],
      view: "base",
    }
    const query = qs.stringify(queryParams)
    const res = await supertest(app.getHttpServer()).get(`/listings?${query}`).expect(200)
    expect(res.body.items.length).toBe(0)
  })

  it("should modify property related fields of a listing and return a modified value", async () => {
    const res = await supertest(app.getHttpServer()).get("/listings").expect(200)

    const listing: ListingDto = { ...res.body.items[0] }

    const amenitiesValue = "Random amenities value"
    expect(listing.amenities).not.toBe(amenitiesValue)
    listing.amenities = amenitiesValue

    const oldOccupancy = Number(listing.units[0].maxOccupancy)
    listing.units[0].maxOccupancy = oldOccupancy + 1

    const putResponse = await supertest(app.getHttpServer())
      .put(`/listings/${listing.id}`)
      .send(listing)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    const modifiedListing: ListingDto = putResponse.body
    expect(modifiedListing.amenities).toBe(amenitiesValue)
    expect(modifiedListing.units[0].maxOccupancy).toBe(oldOccupancy + 1)
  })

  it("should add/overwrite image in existing listing", async () => {
    const res = await supertest(app.getHttpServer()).get("/listings").expect(200)

    const listing: ListingUpdateDto = { ...res.body.items[0] }

    const fileId = "fileId"
    const label = "label"
    const image: AssetCreateDto = {
      fileId: fileId,
      label: label,
    }

    const assetCreateResponse = await supertest(app.getHttpServer())
      .post(`/assets`)
      .send(image)
      .set(...setAuthorization(adminAccessToken))
      .expect(201)
    listing.images = [{ image: assetCreateResponse.body, ordinal: 1 }]

    const putResponse = await supertest(app.getHttpServer())
      .put(`/listings/${listing.id}`)
      .send(listing)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    const modifiedListing: ListingDto = putResponse.body

    expect(modifiedListing.images[0].image.id).toBe(assetCreateResponse.body.id)
  })

  it("should add/overwrite application methods in existing listing", async () => {
    const res = await supertest(app.getHttpServer()).get("/listings").expect(200)

    const listing: Listing = { ...res.body.items[0] }

    const assetCreateDto: AssetCreateDto = {
      fileId: "testFileId2",
      label: "testLabel2",
    }

    const file = await supertest(app.getHttpServer())
      .post(`/assets`)
      .send(assetCreateDto)
      .set(...setAuthorization(adminAccessToken))
      .expect(201)

    const am: ApplicationMethodCreateDto = {
      type: ApplicationMethodType.FileDownload,
      paperApplications: [{ file: file.body, language: Language.en }],
      listing,
    }

    const applicationMethod = await supertest(app.getHttpServer())
      .post(`/applicationMethods`)
      .send(am)
      .set(...setAuthorization(adminAccessToken))
      .expect(201)

    listing.applicationMethods = [applicationMethod.body]

    const putResponse = await supertest(app.getHttpServer())
      .put(`/listings/${listing.id}`)
      .send(listing)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    const modifiedListing: ListingDto = putResponse.body

    expect(modifiedListing.applicationMethods[0]).toHaveProperty("id")
  })

  it("should add/overwrite listing events in existing listing", async () => {
    const res = await supertest(app.getHttpServer()).get("/listings").expect(200)

    const listing: ListingUpdateDto = { ...res.body.items[0] }

    const listingEvent: ListingEventCreateDto = {
      type: ListingEventType.openHouse,
      startTime: new Date(),
      endTime: new Date(),
      url: "https://www.testurl.com",
      note: "testnote",
      label: "testlabel",
      file: {
        fileId: "testid",
        label: "testlabel",
      },
    }
    listing.events = [listingEvent]

    const putResponse = await supertest(app.getHttpServer())
      .put(`/listings/${listing.id}`)
      .send(listing)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)

    const modifiedListing: ListingDto = putResponse.body

    expect(modifiedListing.events.length).toBe(1)
    expect(modifiedListing.events[0].url).toBe(listingEvent.url)
    expect(modifiedListing.events[0].note).toBe(listingEvent.note)
    expect(modifiedListing.events[0].label).toBe(listingEvent.label)
    expect(modifiedListing.events[0].file.id).toBeDefined()
    expect(modifiedListing.events[0].file.fileId).toBe(listingEvent.file.fileId)
    expect(modifiedListing.events[0].file.label).toBe(listingEvent.file.label)
  })

  it("defaults to sorting listings by applicationDueDate", async () => {
    const res = await supertest(app.getHttpServer()).get(`/listings?limit=all`).expect(200)
    const listings = res.body.items

    // The Coliseum seed has the soonest applicationDueDate (1 day in the future)
    expect(listings[0].name).toBe("Test: Coliseum")

    // Triton and "Default, No Preferences" share the next-soonest applicationDueDate
    // (5 days in the future). Between the two, Triton 2 appears first because it has
    // the closer applicationOpenDate. (edit sort order between Triton 1 and Triton 2 is random now as
    // we have removed the default applicationOpenDate sort order
    const secondListing = listings[1]
    const thirdListing = listings[2]
    const fourthListing = listings[3]
    expect(fourthListing.name).toBe("Test: Default, No Preferences")

    const secondListingAppDueDate = new Date(secondListing.applicationDueDate)
    const thirdListingAppDueDate = new Date(thirdListing.applicationDueDate)
    expect(secondListingAppDueDate.getDate()).toEqual(thirdListingAppDueDate.getDate())

    // Verify that listings with null applicationDueDate's appear at the end.
    const lastListing = listings[listings.length - 1]
    expect(lastListing.applicationDueDate).toBeNull()
  })

  it("sorts listings by most recently updated when that orderBy param is set", async () => {
    const res = await supertest(app.getHttpServer())
      .get(`/listings?orderBy[0]=mostRecentlyUpdated&orderDir[0]=DESC&limit=all`)
      .expect(200)
    for (let i = 0; i < res.body.items.length - 1; ++i) {
      const currentUpdatedAt = new Date(res.body.items[i].updatedAt)
      const nextUpdatedAt = new Date(res.body.items[i + 1].updatedAt)

      // Verify that each listing's updatedAt timestamp is more recent than the next listing's.
      expect(currentUpdatedAt.getTime()).toBeGreaterThan(nextUpdatedAt.getTime())
    }
  })

  it("fails if orderBy param doesn't conform to one of the enum values", async () => {
    await supertest(app.getHttpServer()).get(`/listings?orderBy=notAValidOrderByParam`).expect(400)
  })

  it("sorts results within a page, and across sequential pages", async () => {
    // Get the first page of 5 results.
    const firstPage = await supertest(app.getHttpServer())
      .get(`/listings?orderBy[0]=mostRecentlyUpdated&orderDir[0]=DESC&limit=5&page=1`)
      .expect(200)

    // Verify that listings on the first page are ordered from most to least recently updated.
    for (let i = 0; i < 4; ++i) {
      const currentUpdatedAt = new Date(firstPage.body.items[i].updatedAt)
      const nextUpdatedAt = new Date(firstPage.body.items[i + 1].updatedAt)

      // Verify that each listing's updatedAt timestamp is more recent than the next listing's.
      expect(currentUpdatedAt.getTime()).toBeGreaterThan(nextUpdatedAt.getTime())
    }

    const lastListingOnFirstPageUpdateTimestamp = new Date(firstPage.body.items[4].updatedAt)

    // Get the second page of 5 results
    const secondPage = await supertest(app.getHttpServer())
      .get(`/listings?orderBy[0]=mostRecentlyUpdated&orderDir[0]=DESC&limit=5&page=2`)
      .expect(200)

    // Verify that each of the listings on the second page was less recently updated than the last
    // first-page listing.
    for (const secondPageListing of secondPage.body.items) {
      const secondPageListingUpdateTimestamp = new Date(secondPageListing.updatedAt)
      expect(lastListingOnFirstPageUpdateTimestamp.getTime()).toBeGreaterThan(
        secondPageListingUpdateTimestamp.getTime()
      )
    }
  })

  it("should add/overwrite and remove listing programs in existing listing", async () => {
    const res = await supertest(app.getHttpServer()).get("/listings").expect(200)
    const listing: ListingUpdateDto = { ...res.body.items[0] }
    const newProgram: MultiselectQuestionDto = await questionRepository.save({
      text: "TestTitle",
      subText: "TestSubtitle",
      description: "TestDescription",
      applicationSection: ApplicationSection.programs,
    })
    listing.listingMultiselectQuestions = [{ multiselectQuestion: newProgram, ordinal: 1 }]
    const putResponse = await supertest(app.getHttpServer())
      .put(`/listings/${listing.id}`)
      .send(listing)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)

    const listingResponse = await supertest(app.getHttpServer())
      .get(`/listings/${putResponse.body.id}`)
      .expect(200)

    expect(listingResponse.body.listingMultiselectQuestions[0].multiselectQuestion.id).toBe(
      newProgram.id
    )
    expect(listingResponse.body.listingMultiselectQuestions[0].multiselectQuestion.text).toBe(
      newProgram.text
    )
    expect(listingResponse.body.listingMultiselectQuestions[0].ordinal).toBe(1)

    await supertest(app.getHttpServer())
      .put(`/listings/${listing.id}`)
      .send({
        ...putResponse.body,
        listingMultiselectQuestions: [],
      })
      .set(...setAuthorization(adminAccessToken))
      .expect(200)

    const listingResponse2 = await supertest(app.getHttpServer())
      .get(`/listings/${putResponse.body.id}`)
      .expect(200)
    expect(listingResponse2.body.listingMultiselectQuestions.length).toBe(0)
  })

  it("should find listing by search", async () => {
    const anyJurisdiction = (await jurisdictionsRepository.find({ take: 1 }))[0]
    const newListingCreateDto = makeTestListing(anyJurisdiction.id)

    const newListingName = "random-name"
    newListingCreateDto.name = newListingName

    let listingsSearchResponse = await supertest(app.getHttpServer())
      .get(`/listings?search=random`)
      .expect(200)

    expect(listingsSearchResponse.body.items.length).toBe(0)

    const listingResponse = await supertest(app.getHttpServer())
      .post(`/listings`)
      .send(newListingCreateDto)
      .set(...setAuthorization(adminAccessToken))
    expect(listingResponse.body.name).toBe(newListingName)

    listingsSearchResponse = await supertest(app.getHttpServer()).get(`/listings`).expect(200)
    expect(listingsSearchResponse.body.items.length).toBeGreaterThan(1)

    listingsSearchResponse = await supertest(app.getHttpServer())
      .get(`/listings?search=random`)
      .expect(200)

    expect(listingsSearchResponse.body.items.length).toBe(1)
    expect(listingsSearchResponse.body.items[0].name).toBe(newListingName)
  })
  describe("listings approval notification", () => {
    const mockChangesRequested = jest.spyOn(testEmailService, "changesRequested")
    const mockRequestApproval = jest.spyOn(testEmailService, "requestApproval")
    const mockListingApproved = jest.spyOn(testEmailService, "listingApproved")
    it("should update listing status and notify appropriate users", async () => {
      const adminId = (await userRepository.find({ where: { email: "admin@example.com" } }))?.[0]
        ?.id
      const queryParams = {
        limit: "all",
        filter: [
          {
            $comparison: "=",
            name: "Test: Draft",
          },
        ],
      }
      const query = qs.stringify(queryParams)
      const res = await supertest(app.getHttpServer()).get(`/listings?${query}`).expect(200)
      const listing: ListingUpdateDto = { ...res.body.items[0] }
      listing.status = ListingStatus.pendingReview
      const putPendingApprovalResponse = await supertest(app.getHttpServer())
        .put(`/listings/${listing.id}`)
        .send(listing)
        .set(...setAuthorization(adminAccessToken))
        .expect(200)

      const listingPendingApprovalResponse = await supertest(app.getHttpServer())
        .get(`/listings/${putPendingApprovalResponse.body.id}`)
        .expect(200)

      expect(listingPendingApprovalResponse.body.status).toBe(ListingStatus.pendingReview)
      expect(mockRequestApproval).toBeCalledWith(
        expect.objectContaining({
          id: adminId,
        }),
        { id: listing.id, name: listing.name },
        expect.arrayContaining(["admin@example.com", "mfauser@bloom.com"]),
        "http://localhost:3001"
      )

      listing.status = ListingStatus.changesRequested
      const putChangesRequestedResponse = await supertest(app.getHttpServer())
        .put(`/listings/${listing.id}`)
        .send(listing)
        .set(...setAuthorization(adminAccessToken))
        .expect(200)

      const listingChangesRequestedResponse = await supertest(app.getHttpServer())
        .get(`/listings/${putChangesRequestedResponse.body.id}`)
        .expect(200)

      expect(listingChangesRequestedResponse.body.status).toBe(ListingStatus.changesRequested)
      expect(mockChangesRequested).toBeCalledWith(
        expect.objectContaining({
          id: adminId,
        }),
        { id: listing.id, name: listing.name },
        expect.arrayContaining(["leasing-agent-2@example.com"]),
        "http://localhost:3001"
      )

      listing.status = ListingStatus.active
      const putApprovedResponse = await supertest(app.getHttpServer())
        .put(`/listings/${listing.id}`)
        .send(listing)
        .set(...setAuthorization(adminAccessToken))
        .expect(200)

      const listingApprovedResponse = await supertest(app.getHttpServer())
        .get(`/listings/${putApprovedResponse.body.id}`)
        .expect(200)

      expect(listingApprovedResponse.body.status).toBe(ListingStatus.active)
      expect(mockListingApproved).toBeCalledWith(
        expect.objectContaining({
          id: adminId,
        }),
        { id: listing.id, name: listing.name },
        expect.arrayContaining(["leasing-agent-2@example.com"]),
        "http://localhost:3000"
      )
    })

    it("should create pending review listing and notify appropriate users", async () => {
      const alameda = (await jurisdictionsRepository.find({ where: { name: "Alameda" } }))[0]
      const adminId = (await userRepository.find({ where: { email: "admin@example.com" } }))?.[0]
        ?.id
      const newListingCreateDto = makeTestListing(alameda.id)
      const newListingName = "New Alameda Listing"
      newListingCreateDto.name = newListingName
      newListingCreateDto.status = ListingStatus.pendingReview
      newListingCreateDto.units = [
        {
          listing: newListingName,
          amiChart: null,
          amiPercentage: "30",
          annualIncomeMax: "45600",
          annualIncomeMin: "36168",
          bmrProgramChart: false,
          floor: 1,
          maxOccupancy: 3,
          minOccupancy: 1,
          monthlyIncomeMin: "3014",
          monthlyRent: "1219",
          monthlyRentAsPercentOfIncome: null,
          numBathrooms: 0,
          numBedrooms: 1,
          number: null,
          sqFeet: "635",
        },
      ]

      const listingResponse = await supertest(app.getHttpServer())
        .post(`/listings`)
        .send(newListingCreateDto)
        .set(...setAuthorization(adminAccessToken))

      expect(listingResponse.body.name).toBe(newListingName)
      expect(listingResponse.body.status).toBe(ListingStatus.pendingReview)
      expect(mockRequestApproval).toBeCalledWith(
        expect.objectContaining({
          id: adminId,
        }),
        { id: listingResponse.body.id, name: listingResponse.body.name },
        expect.arrayContaining(["admin@example.com", "mfauser@bloom.com"]),
        "http://localhost:3001"
      )
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
