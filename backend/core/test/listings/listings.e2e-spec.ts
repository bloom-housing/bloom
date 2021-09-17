import { Test } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ListingsModule } from "../../src/listings/listings.module"
import supertest from "supertest"
import { applicationSetup } from "../../src/app.module"
import { ListingDto, ListingUpdateDto } from "../../src/listings/dto/listing.dto"
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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dbOptions = require("../../ormconfig.test")

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
jest.setTimeout(30000)

describe("Listings", () => {
  let app
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dbOptions),
        ListingsModule,
        AssetsModule,
        ApplicationMethodsModule,
        PaperApplicationsModule,
      ],
    }).compile()
    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()
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
    const limit = 9
    const params = "/?page=" + page + "&limit=" + limit.toString()
    const res = await supertest(app.getHttpServer())
      .get("/listings" + params)
      .expect(200)
    expect(res.body.items.length).toEqual(limit)
  })

  it("should return the last page of paginated listings", async () => {
    // Make the limit 1 less than the full number of listings, so that the second page contains
    // only one listing.
    const page = "2"
    const limit = "12"
    const params = "/?page=" + page + "&limit=" + limit
    const res = await supertest(app.getHttpServer())
      .get("/listings" + params)
      .expect(200)
    expect(res.body.items.length).toEqual(1)
  })

  // TODO: replace jsonpath with SQL-level filtering
  it("should return only the specified listings", async () => {
    const query =
      "/?limit=all&jsonpath=%24%5B%3F%28%40.applicationAddress.city%3D%3D%22Foster%20City%22%29%5D"
    const res = await supertest(app.getHttpServer()).get(`/listings${query}`).expect(200)
    expect(res.body.items.length).toEqual(1)
    expect(res.body.items[0].applicationAddress.city).toEqual("Foster City")
  })

  // TODO: replace jsonpath with SQL-level filtering
  it("shouldn't return any listings for incorrect query", async () => {
    const query = "/?jsonpath=%24%5B%3F(%40.applicationNONSENSE.argh%3D%3D%22San+Jose%22)%5D"
    const res = await supertest(app.getHttpServer()).get(`/listings${query}`).expect(200)
    expect(res.body.items.length).toEqual(0)
  })

  // TODO: replace jsonpath with SQL-level filtering
  it("should return only active listings", async () => {
    const query = "/?limit=all&jsonpath=%24%5B%3F%28%40.status%3D%3D%22active%22%29%5D"
    const res = await supertest(app.getHttpServer()).get(`/listings${query}`).expect(200)
    expect(res.body.items.map((listing) => listing.id).length).toBeGreaterThan(0)
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
    }
    const query = qs.stringify(queryParams)
    const res = await supertest(app.getHttpServer()).get(`/listings?${query}`).expect(200)
    expect(res.body.items.length).toBeGreaterThanOrEqual(2)
  })

  it("should modify property related fields of a listing and return a modified value", async () => {
    const res = await supertest(app.getHttpServer()).get("/listings").expect(200)

    const listing: ListingDto = { ...res.body.items[0] }

    const amenitiesValue = "Random amenities value"
    expect(listing.amenities).not.toBe(amenitiesValue)
    listing.amenities = amenitiesValue

    const oldOccupancy = Number(listing.units[0].maxOccupancy)
    listing.units[0].maxOccupancy = oldOccupancy + 1

    const adminAccessToken = await getUserAccessToken(app, "admin@example.com", "abcdef")

    const putResponse = await supertest(app.getHttpServer())
      .put(`/listings/${listing.id}`)
      .send(listing)
      .set(...setAuthorization(adminAccessToken))
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
    listing.image = image

    const adminAccessToken = await getUserAccessToken(app, "admin@example.com", "abcdef")

    const putResponse = await supertest(app.getHttpServer())
      .put(`/listings/${listing.id}`)
      .send(listing)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    const modifiedListing: ListingDto = putResponse.body

    expect(modifiedListing.image.fileId).toBe(fileId)
    expect(modifiedListing.image.label).toBe(label)
    expect(modifiedListing.image).toHaveProperty("id")
    expect(modifiedListing.image).toHaveProperty("createdAt")
    expect(modifiedListing.image).toHaveProperty("updatedAt")
  })

  it("should add/overwrite application methods in existing listing", async () => {
    const res = await supertest(app.getHttpServer()).get("/listings").expect(200)

    const listing: Listing = { ...res.body.items[0] }

    const adminAccessToken = await getUserAccessToken(app, "admin@example.com", "abcdef")

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

    const adminAccessToken = await getUserAccessToken(app, "admin@example.com", "abcdef")

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

  it("defaults to sorting listings by applicationDueDate, then applicationOpenDate", async () => {
    const res = await supertest(app.getHttpServer()).get(`/listings?limit=all`).expect(200)
    const listings = res.body.items

    // The Coliseum seed has the soonest applicationDueDate (1 day in the future)
    expect(listings[0].name).toBe("Test: Coliseum")

    // Triton and "Default, No Preferences" share the next-soonest applicationDueDate
    // (5 days in the future). Between the two, Triton appears first because it has
    // the earlier applicationOpenDate.
    const secondListing = listings[1]
    expect(secondListing.name).toBe("Test: Triton")
    const thirdListing = listings[2]
    expect(thirdListing.name).toBe("Test: Default, No Preferences")

    const secondListingAppDueDate = new Date(secondListing.applicationDueDate)
    const thirdListingAppDueDate = new Date(thirdListing.applicationDueDate)
    expect(secondListingAppDueDate.getDate()).toEqual(thirdListingAppDueDate.getDate())

    const secondListingAppOpenDate = new Date(secondListing.applicationOpenDate)
    const thirdListingAppOpenDate = new Date(thirdListing.applicationOpenDate)
    expect(secondListingAppOpenDate.getTime()).toBeLessThanOrEqual(
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
    const firstPage = await supertest(app.getHttpServer())
      .get(`/listings?orderBy=mostRecentlyUpdated&limit=5&page=1`)
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

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
