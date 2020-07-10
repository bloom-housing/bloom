import { Test } from "@nestjs/testing"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../../ormconfig.test")
import supertest from "supertest"
import { UserApplicationsModule } from "../../src/user-applications/user-applications.module"
import { UserModule } from "../../src/user/user.module"
import { AuthModule } from "../../src/auth/auth.module"
import { ListingsModule } from "../../src/listings/listings.module"
import { applicationSetup } from "../../src/app.module"

describe("Applications", () => {
  let app: INestApplication
  let userId: string
  let accessToken: string
  let listingId: any

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AuthModule,
        UserModule,
        ListingsModule,
        UserApplicationsModule,
        TypeOrmModule.forRoot(dbOptions),
      ],
    }).compile()
    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()
    let res = await supertest(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "test@example.com", password: "abcdef" })
      .expect(201)
    accessToken = res.body.accessToken
    res = await supertest(app.getHttpServer())
      .get("/user/profile")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200)
    userId = res.body.id
    res = await supertest(app.getHttpServer()).get("/").expect(200)
    listingId = res.body.listings[0].id
  })

  it(`/GET `, async () => {
    const res = await supertest(app.getHttpServer())
      .get(`/user/${userId}/applications`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it(`/POST `, async () => {
    const body = {
      listingId,
      userId,
      application: {
        foo: "bar",
      },
    }
    const res = await supertest(app.getHttpServer())
      .post(`/user/${userId}/applications`)
      .send(body)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(201)
    expect(res.body).toEqual(expect.objectContaining(body))
    expect(res.body).toHaveProperty("createdAt")
    expect(res.body).toHaveProperty("updatedAt")
    expect(res.body).toHaveProperty("id")
  })

  it(`/DELETE `, async () => {
    const body = {
      listingId,
      userId,
      application: {
        foo: "bar",
      },
    }
    const createRes = await supertest(app.getHttpServer())
      .post(`/user/${userId}/applications`)
      .send(body)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(201)
    await supertest(app.getHttpServer())
      .delete(`/user/${userId}/applications/${createRes.body.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200)
    const res = await supertest(app.getHttpServer())
      .get(`/user/${userId}/applications/${createRes.body.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404)
  })

  it(`/PUT `, async () => {
    const body = {
      listingId,
      userId,
      application: {
        foo: "bar",
      },
    }
    const createRes = await supertest(app.getHttpServer())
      .post(`/user/${userId}/applications`)
      .send(body)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(201)
    expect(createRes.body).toEqual(expect.objectContaining(body))
    const newBody = {
      id: createRes.body.id,
      userId,
      listingId,
      application: {
        foo: "new bar",
      },
    }
    const putRes = await supertest(app.getHttpServer())
      .put(`/user/${userId}/applications/${createRes.body.id}`)
      .send(newBody)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200)
    expect(putRes.body).toEqual(expect.objectContaining(newBody))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
