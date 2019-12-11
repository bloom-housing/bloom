import application from "../src/index"
import request from "supertest"

describe("GET / - a simple api endpoint", () => {
  it("Hello API Request", async () => {
    const req = await request(application).get("/")
    expect(req.body.listings.length).toEqual(3)
  })

  afterAll(async done => {
    application.close()
    await done()
  })
})
