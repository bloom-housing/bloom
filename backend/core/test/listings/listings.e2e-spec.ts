import { Test } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ListingsModule } from "../../src/listings/listings.module"
import supertest from "supertest"
import { applicationSetup } from "../../src/app.module"
import { allSeeds } from "../../src/seeds/listings"

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
      imports: [TypeOrmModule.forRoot(dbOptions), ListingsModule],
    }).compile()
    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()
  })

  it("should return all listings", async () => {
    const res = await supertest(app.getHttpServer()).get("/listings").expect(200)
    expect(res.body.items.length).toEqual(allSeeds.length)
  })

  it("should return the first page of paginated listings", async () => {
    // Make the limit 1 less than the full number of listings, so that the first page contains all
    // but the last listing.
    const page = "1"
    const limit = allSeeds.length - 1
    const params = "/?page=" + page + "&limit=" + limit.toString()
    const res = await supertest(app.getHttpServer())
      .get("/listings" + params)
      .expect(200)
    expect(res.body.items.length).toEqual(allSeeds.length - 1)
    expect(res.body.meta).toEqual({
      currentPage: 1,
      itemCount: limit,
      itemsPerPage: limit,
      totalItems: allSeeds.length,
      totalPages: 2,
    })
  })

  it("should return the last page of paginated listings", async () => {
    // Make the limit 1 less than the full number of listings, so that the second page contains
    // only one listing.
    const page = "2"
    const limit = allSeeds.length - 1
    const params = "/?page=" + page + "&limit=" + limit.toString()
    const res = await supertest(app.getHttpServer())
      .get("/listings" + params)
      .expect(200)
    expect(res.body.items.length).toEqual(1)
    expect(res.body.meta).toEqual({
      currentPage: 2,
      itemCount: 1,
      itemsPerPage: limit,
      totalItems: allSeeds.length,
      totalPages: 2,
    })
  })

  // TODO: replace jsonpath with SQL-level filtering
  it("should return only the specified listings", async () => {
    const query =
      "/?jsonpath=%24%5B%3F%28%40.applicationAddress.city%3D%3D%22Foster%20City%22%29%5D"
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
    const query = "/?jsonpath=%24%5B%3F%28%40.status%3D%3D%22active%22%29%5D"
    const res = await supertest(app.getHttpServer()).get(`/listings${query}`).expect(200)
    expect(res.body.items.length).toEqual(allSeeds.length)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
