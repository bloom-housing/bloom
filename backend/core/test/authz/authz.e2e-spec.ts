import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../../ormconfig.test")

import supertest from "supertest"
import { applicationSetup, AppModule } from "../../src/app.module"
import { getUserAccessToken } from "../utils/get-user-access-token"
import { setAuthorization } from "../utils/set-authorization-helper"
jest.setTimeout(30000)

describe("Authz", () => {
  let app: INestApplication
  let userAccessToken: string
  const adminOnlyEndpoints = ["/preferences", "/units", "/translations"]
  const applicationsEndpoint = "/applications"
  const listingsEndpoint = "/listings"
  const userEndpoint = "/user"

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule.register(dbOptions)],
    }).compile()

    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()
    userAccessToken = await getUserAccessToken(app, "test@example.com", "abcdef")
  })

  describe("admin endpoints", () => {
    it(`should not allow normal/anonymous user to GET to admin only endpoints`, async () => {
      for (const endpoint of adminOnlyEndpoints) {
        // anonymous
        await supertest(app.getHttpServer()).get(endpoint).expect(403)
        // logged in normal user
        await supertest(app.getHttpServer())
          .get(endpoint)
          .set(...setAuthorization(userAccessToken))
          .expect(403)
      }
    })
    it(`should not allow normal/anonymous user to GET/:id to admin only endpoints`, async () => {
      for (const endpoint of adminOnlyEndpoints) {
        // anonymous
        await supertest(app.getHttpServer())
          .get(endpoint + "/fake_id")
          .expect(403)
        // logged in normal user
        await supertest(app.getHttpServer())
          .get(endpoint + "/fake_id")
          .set(...setAuthorization(userAccessToken))
          .expect(403)
      }
    })
    it(`should not allow normal/anonymous user to POST to admin only endpoints`, async () => {
      for (const endpoint of adminOnlyEndpoints) {
        // anonymous
        await supertest(app.getHttpServer()).post(endpoint).send({}).expect(403)
        // logged in normal user
        await supertest(app.getHttpServer())
          .post(endpoint)
          .send({})
          .set(...setAuthorization(userAccessToken))
          .expect(403)
      }
    })
    it(`should not allow normal/anonymous user to PUT to admin only endpoints`, async () => {
      for (const endpoint of adminOnlyEndpoints) {
        // anonymous
        await supertest(app.getHttpServer())
          .put(endpoint + "/fake_id")
          .send({})
          .expect(403)
        // logged in normal user
        await supertest(app.getHttpServer())
          .put(endpoint + "/fake_id")
          .send({})
          .set(...setAuthorization(userAccessToken))
          .expect(403)
      }
    })
    it(`should not allow normal/anonymous user to DELETE to admin only endpoints`, async () => {
      for (const endpoint of adminOnlyEndpoints) {
        // anonymous
        await supertest(app.getHttpServer())
          .delete(endpoint + "/fake_id")
          .expect(403)
        // logged in normal user
        await supertest(app.getHttpServer())
          .delete(endpoint + "/fake_id")
          .set(...setAuthorization(userAccessToken))
          .expect(403)
      }
    })
  })

  describe("user", () => {
    it(`should not allow anonymous user to GET to get any user profile`, async () => {
      await supertest(app.getHttpServer()).get(userEndpoint).expect(403)
    })

    it(`should allow a logged in user to GET to get any user profile`, async () => {
      await supertest(app.getHttpServer())
        .get(userEndpoint)
        .set(...setAuthorization(userAccessToken))
        .expect(200)
    })

    it(`should allow anonymous user to CREATE a user`, async () => {
      await supertest(app.getHttpServer()).post(userEndpoint).expect(400)
    })
  })

  describe("applications", () => {
    it("should not allow anonymous user to GET applications", async () => {
      await supertest(app.getHttpServer()).get(applicationsEndpoint).expect(403)
    })
    it("should allow logged in user to GET applications", async () => {
      await supertest(app.getHttpServer())
        .get(applicationsEndpoint)
        .set(...setAuthorization(userAccessToken))
        .expect(200)
    })
    it("should not allow anonymous user to GET CSV applications", async () => {
      await supertest(app.getHttpServer())
        .get(applicationsEndpoint + "/csv")
        .expect(403)
    })
    it("should not allow anonymous user to GET applications by ID", async () => {
      await supertest(app.getHttpServer())
        .get(applicationsEndpoint + "/fake_id")
        .expect(403)
    })
    it(`should not allow normal/anonymous user to DELETE applications`, async () => {
      // anonymous
      await supertest(app.getHttpServer())
        .delete(applicationsEndpoint + "/fake_id")
        .expect(403)
      // logged in normal user
      await supertest(app.getHttpServer())
        .delete(applicationsEndpoint + "/fake_id")
        .set(...setAuthorization(userAccessToken))
        .expect(403)
    })
    it(`should not allow normal/anonymous user to PUT applications`, async () => {
      // anonymous
      await supertest(app.getHttpServer())
        .put(applicationsEndpoint + "/fake_id")
        .expect(403)
      // logged in normal user
      await supertest(app.getHttpServer())
        .put(applicationsEndpoint + "/fake_id")
        .set(...setAuthorization(userAccessToken))
        .expect(403)
    })
    it(`should allow normal/anonymous user to POST applications`, async () => {
      // anonymous
      await supertest(app.getHttpServer())
        .post(applicationsEndpoint + "/submit")
        .expect(400)
      // logged in normal user
      await supertest(app.getHttpServer())
        .post(applicationsEndpoint + "/submit")
        .set(...setAuthorization(userAccessToken))
        .expect(400)
    })
  })
  describe("listings", () => {
    it("should allow anonymous user to GET listings", async () => {
      await supertest(app.getHttpServer()).get(listingsEndpoint).expect(200)
    })
    it("should allow anonymous user to GET listings by ID", async () => {
      const res = await supertest(app.getHttpServer()).get(listingsEndpoint).expect(200)
      await supertest(app.getHttpServer())
        .get(`${listingsEndpoint}/${res.body.items[0].id}`)
        .expect(200)
    })
    it(`should not allow normal/anonymous user to DELETE listings`, async () => {
      // anonymous
      await supertest(app.getHttpServer())
        .delete(listingsEndpoint + "/fake_id")
        .expect(403)
      // logged in normal user
      await supertest(app.getHttpServer())
        .delete(listingsEndpoint + "/fake_id")
        .set(...setAuthorization(userAccessToken))
        .expect(403)
    })
    it(`should not allow normal/anonymous user to PUT listings`, async () => {
      // anonymous
      await supertest(app.getHttpServer())
        .put(listingsEndpoint + "/fake_id")
        .expect(403)
      // logged in normal user
      await supertest(app.getHttpServer())
        .put(listingsEndpoint + "/fake_id")
        .set(...setAuthorization(userAccessToken))
        .expect(403)
    })
    it(`should allow normal/anonymous user to POST listings`, async () => {
      // anonymous
      await supertest(app.getHttpServer()).post(listingsEndpoint).expect(403)
      // logged in normal user
      await supertest(app.getHttpServer())
        .post(listingsEndpoint)
        .set(...setAuthorization(userAccessToken))
        .expect(403)
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
