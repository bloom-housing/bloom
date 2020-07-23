import { Test } from "@nestjs/testing"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../../ormconfig.test")
import supertest from "supertest"
import { AuthModule } from "../../src/auth/auth.module"
import { UserModule } from "../../src/user/user.module"
import { ListingsModule } from "../../src/listings/listings.module"
import { EntityNotFoundExceptionFilter } from "../../src/filters/entity-not-found-exception.filter"
import { ApplicationsModule } from "../../src/applications/applications.module"

describe("Applications", () => {
  let app: INestApplication
  let user1Id: string
  let user1AccessToken: string
  let user2Id: string
  let user2AccessToken: string
  let listingId: any

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AuthModule,
        UserModule,
        ListingsModule,
        ApplicationsModule,
        TypeOrmModule.forRoot(dbOptions),
      ],
    }).compile()
    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    app.useGlobalFilters(new EntityNotFoundExceptionFilter())
    await app.init()
    let res = await supertest(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "test@example.com", password: "abcdef" })
      .expect(201)
    user1AccessToken = res.body.accessToken
    res = await supertest(app.getHttpServer())
      .get("/user/profile")
      .set("Authorization", `Bearer ${user1AccessToken}`)
      .expect(200)
    user1Id = res.body.id

    res = await supertest(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "test2@example.com", password: "ghijkl" })
      .expect(201)
    user2AccessToken = res.body.accessToken
    res = await supertest(app.getHttpServer())
      .get("/user/profile")
      .set("Authorization", `Bearer ${user2AccessToken}`)
      .expect(200)
    user2Id = res.body.id

    res = await supertest(app.getHttpServer()).get("/").expect(200)
    listingId = res.body.listings[0].id
  })

  it(`/GET `, async () => {
    const res = await supertest(app.getHttpServer())
      .get(`/applications`)
      .set("Authorization", `Bearer ${user1AccessToken}`)
      .expect(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(1)
  })

  it(`/POST `, async () => {
    const body = {
      listing: {
        id: listingId,
      },
      user: {
        id: user1Id,
      },
      application: {
        foo: "bar",
      },
    }
    const res = await supertest(app.getHttpServer())
      .post(`/applications`)
      .send(body)
      .set("Authorization", `Bearer ${user1AccessToken}`)
      .expect(201)
    expect(res.body).toEqual(expect.objectContaining(body))
    expect(res.body).toHaveProperty("createdAt")
    expect(res.body).toHaveProperty("updatedAt")
    expect(res.body).toHaveProperty("id")
  })

  it(`/POST unauthenticated`, async () => {
    const body = {
      listing: {
        id: listingId,
      },
      application: {
        foo: "bar",
      },
    }
    const res = await supertest(app.getHttpServer()).post(`/applications`).send(body).expect(201)
    expect(res.body).toEqual(expect.objectContaining(body))
    expect(res.body).toHaveProperty("createdAt")
    expect(res.body).toHaveProperty("updatedAt")
    expect(res.body).toHaveProperty("id")
  })

  it(`/POST unauthenticated post disallowed to specify user`, async () => {
    const body = {
      listing: {
        id: listingId,
      },
      application: {
        foo: "bar",
      },
      user: {
        id: user1Id,
      },
    }
    const res = await supertest(app.getHttpServer()).post(`/applications`).send(body).expect(401)
  })

  it(`/POST user 1 unauthorized to create application for user 2`, async () => {
    const body = {
      listing: {
        id: listingId,
      },
      user: {
        id: user2Id,
      },
      application: {
        foo: "bar",
      },
    }
    const res = await supertest(app.getHttpServer())
      .post(`/applications`)
      .send(body)
      .set("Authorization", `Bearer ${user1AccessToken}`)
      .expect(401)
  })

  it(`/DELETE `, async () => {
    const body = {
      listing: {
        id: listingId,
      },
      user: {
        id: user1Id,
      },
      application: {
        foo: "bar",
      },
    }
    const createRes = await supertest(app.getHttpServer())
      .post(`/applications`)
      .send(body)
      .set("Authorization", `Bearer ${user1AccessToken}`)
      .expect(201)
    await supertest(app.getHttpServer())
      .delete(`/applications/${createRes.body.id}`)
      .set("Authorization", `Bearer ${user1AccessToken}`)
      .expect(200)
    const res = await supertest(app.getHttpServer())
      .get(`/applications/${createRes.body.id}`)
      .set("Authorization", `Bearer ${user1AccessToken}`)
      .expect(404)
  })

  it(`/DELETE user 2 unauthorized to delete user 1 application`, async () => {
    const body = {
      listing: {
        id: listingId,
      },
      user: {
        id: user1Id,
      },
      application: {
        foo: "bar",
      },
    }
    const createRes = await supertest(app.getHttpServer())
      .post(`/applications`)
      .send(body)
      .set("Authorization", `Bearer ${user1AccessToken}`)
      .expect(201)
    await supertest(app.getHttpServer())
      .delete(`/applications/${createRes.body.id}`)
      .set("Authorization", `Bearer ${user2AccessToken}`)
      .expect(404)
  })

  it(`/PUT `, async () => {
    const body = {
      listing: {
        id: listingId,
      },
      user: {
        id: user1Id,
      },
      application: {
        foo: "bar",
      },
    }
    const createRes = await supertest(app.getHttpServer())
      .post(`/applications`)
      .send(body)
      .set("Authorization", `Bearer ${user1AccessToken}`)
      .expect(201)
    expect(createRes.body).toEqual(expect.objectContaining(body))
    const newBody = {
      id: createRes.body.id,
      user: {
        id: user1Id,
      },
      listing: {
        id: listingId,
      },
      application: {
        foo: "new bar",
      },
    }
    const putRes = await supertest(app.getHttpServer())
      .put(`/applications/${createRes.body.id}`)
      .send(newBody)
      .set("Authorization", `Bearer ${user1AccessToken}`)
      .expect(200)
    expect(putRes.body).toEqual(expect.objectContaining(newBody))
  })

  it(`/PUT user 2 unauthorized to edit user 1 application`, async () => {
    const body = {
      listing: {
        id: listingId,
      },
      user: {
        id: user1Id,
      },
      application: {
        foo: "bar",
      },
    }
    const createRes = await supertest(app.getHttpServer())
      .post(`/applications`)
      .send(body)
      .set("Authorization", `Bearer ${user1AccessToken}`)
      .expect(201)
    expect(createRes.body).toEqual(expect.objectContaining(body))
    const newBody = {
      id: createRes.body.id,
      user: {
        id: user1Id,
      },
      listing: {
        id: listingId,
      },
      application: {
        foo: "new bar",
      },
    }
    const putRes = await supertest(app.getHttpServer())
      .put(`/applications/${createRes.body.id}`)
      .send(newBody)
      .set("Authorization", `Bearer ${user2AccessToken}`)
      .expect(401)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
