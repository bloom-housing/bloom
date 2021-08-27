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
    // TODO(#374): get this number programmatically
    const limit = 14
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
    const limit = "14"
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
    const query =
      "/?limit=all&jsonpath=%24%5B%3F(%40.applicationNONSENSE.argh%3D%3D%22San+Jose%22)%5D"
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
    const query = "/?limit=all&filter[$comparison]=IN&filter[zipcode]=48211,48201"
    const res = await supertest(app.getHttpServer()).get(`/listings${query}`).expect(200)
    expect(res.body.items.length).toBeGreaterThanOrEqual(2)
  })

  it("should modify property related fields of a listing and return a modified value", async () => {
    const res = await supertest(app.getHttpServer()).get("/listings").expect(200)

    const listing: ListingDto = { ...res.body.items[0] }

    const amenitiesValue = "Random amenities value"
    expect(listing.amenities).not.toBe(amenitiesValue)
    listing.amenities = amenitiesValue

    const oldOccupancy = listing.units[0].maxOccupancy
    listing.units[0].maxOccupancy = oldOccupancy + 1

    const adminAccessToken = await getUserAccessToken(app, "admin@example.com", "abcdef")

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

    const paperApplication = await supertest(app.getHttpServer())
      .post(`/paperApplications`)
      .send({ language: Language.en, file: file.body })
      .set(...setAuthorization(adminAccessToken))
      .expect(201)

    const am: ApplicationMethodCreateDto = {
      type: ApplicationMethodType.FileDownload,
      paperApplications: [{ id: paperApplication.body.id }],
      listing: listing,
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

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
