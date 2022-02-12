import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../../ormconfig.test")

import supertest from "supertest"
import { applicationSetup, AppModule } from "../../src/app.module"
import { getUserAccessToken } from "../utils/get-user-access-token"
import { setAuthorization } from "../utils/set-authorization-helper"
import { UserDto } from "../../src/auth/dto/user.dto"
import { v4 as uuidv4 } from "uuid"
import { Repository } from "typeorm"
import { Application } from "../../src/applications/entities/application.entity"
import { getRepositoryToken } from "@nestjs/typeorm"
import { getTestAppBody } from "../lib/get-test-app-body"
import { Listing } from "../../src/listings/entities/listing.entity"
import { ApplicationDto } from "../../src/applications/dto/application.dto"

jest.setTimeout(30000)

describe("Authz", () => {
  let app: INestApplication
  let userAccessToken: string
  let userProfile: UserDto
  const adminOnlyEndpoints = ["/preferences", "/units", "/translations"]
  const applicationsEndpoint = "/applications"
  const listingsEndpoint = "/listings"
  const userEndpoint = "/user"
  let applicationsRepository: Repository<Application>
  let listingsRepository: Repository<Listing>
  let app1: ApplicationDto

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule.register(dbOptions)],
    }).compile()

    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()

    userAccessToken = await getUserAccessToken(app, "test@example.com", "abcdef")
    userProfile = (
      await supertest(app.getHttpServer())
        .get("/user")
        .set(...setAuthorization(userAccessToken))
    ).body
    applicationsRepository = app.get<Repository<Application>>(getRepositoryToken(Application))
    listingsRepository = app.get<Repository<Listing>>(getRepositoryToken(Listing))
    const listings = await listingsRepository.find({ take: 1 })
    const listing1Application = getTestAppBody(listings[0].id)
    app1 = (
      await supertest(app.getHttpServer())
        .post(`/applications/submit`)
        .send(listing1Application)
        .set("jurisdictionName", "Detroit")
        .set(...setAuthorization(userAccessToken))
    ).body
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
          .get(endpoint + `/${uuidv4()}`)
          .expect(403)
        // logged in normal user
        await supertest(app.getHttpServer())
          .get(endpoint + `/${uuidv4()}`)
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
          .put(endpoint + `/${uuidv4()}`)
          .send({})
          .expect(403)
        // logged in normal user
        await supertest(app.getHttpServer())
          .put(endpoint + `/${uuidv4()}`)
          .send({})
          .set(...setAuthorization(userAccessToken))
          .expect(403)
      }
    })
    it(`should not allow normal/anonymous user to DELETE to admin only endpoints`, async () => {
      for (const endpoint of adminOnlyEndpoints) {
        // anonymous
        await supertest(app.getHttpServer())
          .delete(endpoint + `/${uuidv4()}`)
          .expect(403)
        // logged in normal user
        await supertest(app.getHttpServer())
          .delete(endpoint + `/${uuidv4()}`)
          .set(...setAuthorization(userAccessToken))
          .expect(403)
      }
    })
  })

  describe("user", () => {
    it(`should not allow anonymous user to GET to get any user profile`, async () => {
      await supertest(app.getHttpServer()).get(userEndpoint).expect(401)
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
        .get(applicationsEndpoint + `?userId=${userProfile.id}`)
        .set(...setAuthorization(userAccessToken))
        .expect(200)
    })
    it("should not allow anonymous user to GET CSV applications", async () => {
      await supertest(app.getHttpServer())
        .get(applicationsEndpoint + "/csv")
        .expect(403)
    })
    it("should not allow anonymous user to GET applications by ID", async () => {
      const applications = await applicationsRepository.find({ take: 1 })
      await supertest(app.getHttpServer())
        .get(applicationsEndpoint + `/${applications[0].id}`)
        .expect(403)
    })
    it(`should not allow normal/anonymous user to DELETE applications`, async () => {
      // anonymous
      const applications = await applicationsRepository.find({ take: 1 })
      await supertest(app.getHttpServer())
        .delete(applicationsEndpoint + `/${applications[0].id}`)
        .expect(403)
      // logged in normal user
      await supertest(app.getHttpServer())
        .delete(applicationsEndpoint + `/${applications[0].id}`)
        .set(...setAuthorization(userAccessToken))
        .expect(403)
    })
    it(`should not allow normal/anonymous user to PUT applications`, async () => {
      // anonymous
      await supertest(app.getHttpServer())
        .put(applicationsEndpoint + `/${app1.id}`)
        .send(app1)
        .expect(403)
      // logged in normal user
      await supertest(app.getHttpServer())
        .put(applicationsEndpoint + `/${app1.id}`)
        .set(...setAuthorization(userAccessToken))
        .send(app1)
        .expect(403)
    })
    it.skip(`should allow normal/anonymous user to POST applications`, async () => {
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
        .delete(listingsEndpoint + `/${uuidv4()}`)
        .expect(403)
      // logged in normal user
      await supertest(app.getHttpServer())
        .delete(listingsEndpoint + `/${uuidv4()}`)
        .set(...setAuthorization(userAccessToken))
        .expect(403)
    })
    it(`should not allow normal/anonymous user to PUT listings`, async () => {
      // anonymous
      await supertest(app.getHttpServer())
        .put(listingsEndpoint + `/${uuidv4()}`)
        .expect(403)
      // logged in normal user
      await supertest(app.getHttpServer())
        .put(listingsEndpoint + `/${uuidv4()}`)
        .set(...setAuthorization(userAccessToken))
        .expect(403)
    })
    it(`should not allow normal/anonymous user to POST listings`, async () => {
      // anonymous
      await supertest(app.getHttpServer()).post(listingsEndpoint).expect(403)
    })

    it(`should not allow normal user to change it's role`, async () => {
      let profileRes = await supertest(app.getHttpServer())
        .get("/user")
        .set(...setAuthorization(userAccessToken))
        .expect(200)

      expect(profileRes.body.roles).toBe(null)
      await supertest(app.getHttpServer())
        .put(`/userProfile/${profileRes.body.id}`)
        .send({ ...profileRes.body, roles: { isAdmin: true, isPartner: false } })
        .set(...setAuthorization(userAccessToken))
        .expect(200)

      profileRes = await supertest(app.getHttpServer())
        .get("/user")
        .set(...setAuthorization(userAccessToken))
        .expect(200)

      expect(profileRes.body.roles).toBe(null)
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
