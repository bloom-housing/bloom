import listingsLoader from "@bloom-housing/listings-service/src/lib/listings_loader"
import { Listing } from "@bloom-housing/core"
import { Test } from "@nestjs/testing"
import { ListingsModule } from "../../src/listings/listings.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import dbOptions = require("../../ormconfig.test")
import supertest from "supertest"
import { applicationSetup } from "../../src/app.module"

describe("Listings", () => {
  let app
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ListingsModule, TypeOrmModule.forRoot(dbOptions)],
    }).compile()
    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()
  })

  it("should return all listings", async () => {
    const res = await supertest(app.getHttpServer()).get("/").expect(200)
    const allListings = (await listingsLoader("listings")) as Listing[]
    expect(res.body.listings.length).toEqual(allListings.length)
  })

  it("should return only the specified listings", async () => {
    const query = "/?jsonpath=%24%5B%3F%28%40.applicationAddress.city%3D%3D%22San%20Jose%22%29%5D"
    const res = await supertest(app.getHttpServer()).get(query).expect(200)
    let sjListings = (await listingsLoader("listings")) as Listing[]
    sjListings = sjListings.filter((item) => {
      return item.applicationAddress.city == "San Jose"
    })
    expect(res.body.listings.length).toEqual(sjListings.length)
  })

  it("shouldn't return any listings for incorrect query", async () => {
    const query = "/?jsonpath=%24%5B%3F(%40.applicationNONSENSE.argh%3D%3D%22San+Jose%22)%5D"
    const res = await supertest(app.getHttpServer()).get(query).expect(200)
    expect(res.body.listings.length).toEqual(0)
  })

  it("should return only active listings", async () => {
    const query = "/?jsonpath=%24%5B%3F%28%40.status%3D%3D%22active%22%29%5D"
    const res = await supertest(app.getHttpServer()).get(query).expect(200)
    const sjListings = (await listingsLoader("listings")) as Listing[]
    // One listing has unapproved status.
    expect(res.body.listings.length).toEqual(sjListings.length - 1)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
