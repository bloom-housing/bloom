import application from "../src/index"
import request from "supertest"
import listingsLoader from "../src/lib/listings_loader"
import { Listing } from "@bloom-housing/core/src/listings"

describe("GET /", () => {
  it("should return all listings", async () => {
    const req = await request(application).get("/")
    const allListings = (await listingsLoader("listings")) as Listing[]
    expect(req.body.listings.length).toEqual(allListings.length)
  })

  afterAll(async done => {
    application.close()
    await done()
  })
})

describe("JSONPath queries", () => {
  it("should return only the specified listings", async () => {
    const query = "/?jsonpath=%24%5B%3F(%40.applicationAddress.city%3D%3D%22San+Jose%22)%5D"
    const req = await request(application).get(query)
    let sjListings = (await listingsLoader("listings")) as Listing[]
    sjListings = sjListings.filter(item => {
      return item.applicationAddress.city == "San Jose"
    })
    expect(req.body.listings.length).toEqual(sjListings.length)
  })

  it("shouldn't return any listings for incorrect query", async () => {
    const query = "/?jsonpath=%24%5B%3F(%40.applicationNONSENSE.argh%3D%3D%22San+Jose%22)%5D"
    const req = await request(application).get(query)
    expect(req.body.listings.length).toEqual(0)
  })

  afterAll(async done => {
    application.close()
    await done()
  })
})
