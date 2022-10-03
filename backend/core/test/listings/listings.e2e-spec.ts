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
import { Language } from "../../types"
import { AssetsModule } from "../../src/assets/assets.module"
import { ApplicationMethodsModule } from "../../src/application-methods/applications-methods.module"
import { PaperApplicationsModule } from "../../src/paper-applications/paper-applications.module"
import { ListingEventCreateDto } from "../../src/listings/dto/listing-event.dto"
import { ListingEventType } from "../../src/listings/types/listing-event-type-enum"
import { Listing } from "../../src/listings/entities/listing.entity"
import qs from "qs"
import { ListingUpdateDto } from "../../src/listings/dto/listing-update.dto"
import { Program } from "../../src/program/entities/program.entity"
import { Repository } from "typeorm"
import { INestApplication } from "@nestjs/common"
import dbOptions from "../../ormconfig.test"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
jest.setTimeout(30000)

describe("Listings", () => {
  let app: INestApplication
  let programsRepository: Repository<Program>
  let adminAccessToken: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dbOptions),
        ListingsModule,
        AssetsModule,
        ApplicationMethodsModule,
        PaperApplicationsModule,
        TypeOrmModule.forFeature([Program]),
      ],
    }).compile()
    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()
    programsRepository = app.get<Repository<Program>>(getRepositoryToken(Program))
    adminAccessToken = await getUserAccessToken(app, "admin@example.com", "abcdef")
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
    const limit = 13
    const params = "/?page=" + page + "&limit=" + limit.toString()
    const res = await supertest(app.getHttpServer())
      .get("/listings" + params)
      .expect(200)
    expect(res.body.items.length).toEqual(limit)
  })

  it("should return the last page of paginated listings", async () => {
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

  it("should modify property related fields of a listing and return a modified value", async () => {
    const res = await supertest(app.getHttpServer())
      .get("/listings?orderBy=applicationDates")
      .expect(200)

    const listing: ListingDto = { ...res.body.items[0] }

    const amenitiesValue = "Random amenities value"
    expect(listing.amenities).not.toBe(amenitiesValue)
    listing.amenities = amenitiesValue

    const oldOccupancy = Number(listing.units[0].maxOccupancy)
    listing.units[0].maxOccupancy = oldOccupancy + 1

    listing.neighborhoodAmenities = {
      grocery: "grocery location",
    }

    const putResponse = await supertest(app.getHttpServer())
      .put(`/listings/${listing.id}`)
      .send(listing)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    const modifiedListing: ListingDto = putResponse.body
    expect(modifiedListing.amenities).toBe(amenitiesValue)
    expect(modifiedListing.units[0].maxOccupancy).toBe(oldOccupancy + 1)
    expect(modifiedListing.neighborhoodAmenities).toEqual({
      grocery: "grocery location",
      pharmacy: null,
      medicalClinic: null,
      park: null,
      seniorCenter: null,
    })
  })

  it("should add/overwrite image in existing listing", async () => {
    const res = await supertest(app.getHttpServer())
      .get("/listings?orderBy=applicationDates")
      .expect(200)

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
    const res = await supertest(app.getHttpServer())
      .get("/listings?orderBy=applicationDates")
      .expect(200)

    const listing: ListingUpdateDto = { ...res.body.items[0] }

    const listingEvent: ListingEventCreateDto = {
      type: ListingEventType.openHouse,
      startTime: new Date(),
      endTime: new Date(),
      url: "testurl",
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

  describe.skip("AMI Filter", () => {
    it("should return listings with AMI >= the filter value", async () => {
      const paramsWithEqualAmi = {
        view: "base",
        limit: "all",
        filter: [
          {
            $comparison: "NA",
            minAmiPercentage: "60",
          },
        ],
      }
      const res = await supertest(app.getHttpServer())
        .get("/listings?" + qs.stringify(paramsWithEqualAmi))
        .expect(200)
      expect(res.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "Test: Default, Summary With 30 and 60 Ami Percentage" }),
        ])
      )

      const paramsWithLessAmi = {
        view: "base",
        limit: "all",
        filter: [
          {
            $comparison: "NA",
            minAmiPercentage: "59",
          },
        ],
      }
      const res2 = await supertest(app.getHttpServer())
        .get("/listings?" + qs.stringify(paramsWithLessAmi))
        .expect(200)
      expect(res2.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "Test: Default, Summary With 30 and 60 Ami Percentage" }),
        ])
      )
    })

    it("should not return listings with AMI < the filter value", async () => {
      const params = {
        view: "base",
        limit: "all",
        filter: [
          {
            $comparison: "NA",
            minAmiPercentage: "61",
          },
        ],
      }
      const res = await supertest(app.getHttpServer())
        .get("/listings?" + qs.stringify(params))
        .expect(200)
      expect(res.body.items).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "Test: Default, Summary With 30 and 60 Ami Percentage" }),
        ])
      )
    })

    it("should return listings with matching AMI in Units Summary, even if Listings.amiPercentageMax field does not match", async () => {
      const params = {
        view: "base",
        limit: "all",
        filter: [
          {
            $comparison: "NA",
            minAmiPercentage: "30",
          },
        ],
      }
      const res = await supertest(app.getHttpServer())
        .get("/listings?" + qs.stringify(params))
        .expect(200)
      expect(res.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "Test: Default, Summary With 30 Listing With 10 Ami Percentage",
          }),
        ])
      )
    })

    it("should not return listings with matching AMI in Listings.amiPercentageMax field, if Unit Summary field does not match", async () => {
      const params = {
        view: "base",
        limit: "all",
        filter: [
          {
            $comparison: "NA",
            minAmiPercentage: "30",
          },
        ],
      }
      const res = await supertest(app.getHttpServer())
        .get("/listings?" + qs.stringify(params))
        .expect(200)
      expect(res.body.items).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "Test: Default, Summary With 10 Listing With 30 Ami Percentage",
          }),
        ])
      )
    })

    it("should return listings with matching AMI in the Listings.amiPercentageMax field, if the Unit Summary field is empty", async () => {
      const params = {
        view: "base",
        limit: "all",
        filter: [
          {
            $comparison: "NA",
            minAmiPercentage: "19",
          },
        ],
      }
      const res = await supertest(app.getHttpServer())
        .get("/listings?" + qs.stringify(params))
        .expect(200)
      expect(res.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "Test: Default, Summary Without And Listing With 20 Ami Percentage",
          }),
        ])
      )
    })
  })

  describe.skip("Unit size filtering", () => {
    it("should return listings with >= 1 bedroom", async () => {
      const params = {
        view: "base",
        limit: "all",
        filter: [
          {
            $comparison: ">=",
            bedrooms: "1",
          },
        ],
      }
      const res = await supertest(app.getHttpServer())
        .get("/listings?" + qs.stringify(params))
        .expect(200)

      const listings: Listing[] = res.body.items
      expect(listings.length).toBeGreaterThan(0)
      // expect that all listings have at least one unit with >= 1 bedroom
      /* expect(
        listings.map((listing) => {
          listing.unitsSummary.find((unit) => {
            unit.unitType.some((unitType) => unitType.numBedrooms >= 1)
          }) !== undefined
        })
      ).not.toContain(false) */
    })

    it("should return listings with exactly 1 bedroom", async () => {
      const params = {
        view: "base",
        limit: "all",
        filter: [
          {
            $comparison: "=",
            bedrooms: "1",
          },
        ],
      }
      const res = await supertest(app.getHttpServer())
        .get("/listings?" + qs.stringify(params))
        .expect(200)

      const listings: Listing[] = res.body.items
      expect(listings.length).toBeGreaterThan(0)
      // expect that all listings have at least one unit with exactly 1 bedroom
      /* expect(
        listings.map((listing) => {
          listing.unitsSummary.find((unit) => {
            unit.unitType.some((unitType) => unitType.numBedrooms >= 1)
          }) !== undefined
        })
      ).not.toContain(false) */
    })
  })

  it("defaults to sorting listings by name", async () => {
    const res = await supertest(app.getHttpServer()).get(`/listings?limit=all`).expect(200)
    const listings = res.body.items

    // The Coliseum seed has the soonest applicationDueDate (1 day in the future)
    expect(listings[0].name).toBe("Medical Center Village")

    // Triton and "Default, No Preferences" share the next-soonest applicationDueDate
    // (5 days in the future). Between the two, Triton 1 appears first because it has
    // the closer applicationOpenDate.
    const secondListing = listings[1]
    expect(secondListing.name).toBe("Melrose Square Homes")
    const thirdListing = listings[2]
    expect(thirdListing.name).toBe("New Center Commons")
    const fourthListing = listings[3]
    expect(fourthListing.name).toBe("New Center Pavilion")

    const secondListingAppDueDate = new Date(secondListing.applicationDueDate)
    const thirdListingAppDueDate = new Date(thirdListing.applicationDueDate)
    expect(secondListingAppDueDate.getDate()).toBeGreaterThanOrEqual(
      thirdListingAppDueDate.getDate()
    )

    const secondListingAppOpenDate = new Date(secondListing.applicationOpenDate)
    const thirdListingAppOpenDate = new Date(thirdListing.applicationOpenDate)
    expect(secondListingAppOpenDate.getTime()).toBeGreaterThanOrEqual(
      thirdListingAppOpenDate.getTime()
    )

    // Verify that listings with null applicationDueDate's appear at the end.
    const lastListing = listings[listings.length - 1]
    expect(lastListing.applicationDueDate).toBeNull()
  })

  it("sorts listings by most recently updated when that orderBy param is set", async () => {
    const res = await supertest(app.getHttpServer())
      .get(`/listings?orderBy=mostRecentlyUpdated&limit=all`)
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
    const firstPage = await supertest(app.getHttpServer()).get(
      `/listings?orderBy=mostRecentlyUpdated&limit=5&page=1`
    )
    //.expect(200)
    console.log("firstPage = ", firstPage)

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
      .get(`/listings?orderBy=mostRecentlyUpdated&limit=5&page=2`)
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
    const newProgram = await programsRepository.save({
      title: "TestTitle",
      subtitle: "TestSubtitle",
      description: "TestDescription",
    })
    listing.listingPrograms = [{ program: newProgram, ordinal: 1 }]

    const putResponse = await supertest(app.getHttpServer())
      .put(`/listings/${listing.id}`)
      .send(listing)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)

    const listingResponse = await supertest(app.getHttpServer())
      .get(`/listings/${putResponse.body.id}`)
      .expect(200)

    expect(listingResponse.body.listingPrograms[0].program.id).toBe(newProgram.id)
    expect(listingResponse.body.listingPrograms[0].program.title).toBe(newProgram.title)
    expect(listingResponse.body.listingPrograms[0].ordinal).toBe(1)

    await supertest(app.getHttpServer())
      .put(`/listings/${listing.id}`)
      .send({
        ...putResponse.body,
        listingPrograms: [],
      })
      .set(...setAuthorization(adminAccessToken))
      .expect(200)

    const listingResponse2 = await supertest(app.getHttpServer())
      .get(`/listings/${putResponse.body.id}`)
      .expect(200)
    expect(listingResponse2.body.listingPrograms.length).toBe(0)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
