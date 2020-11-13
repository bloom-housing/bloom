import { Test } from "@nestjs/testing"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../../ormconfig.test")
import supertest from "supertest"
import { applicationSetup } from "../../src/app.module"
import { AssetsModule } from "../../src/assets/assets.module"
import { getUserAccessToken } from "../utils/get-user-access-token"
import { setAuthorization } from "../utils/set-authorization-helper"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

const exampleAssetBody = {
  fileId:
    "https://regional-dahlia-staging.s3-us-west-1.amazonaws.com/listings/archer/archer-studios.jpg",
  label: "building",
}

describe("Assets", () => {
  let app: INestApplication
  let adminAccessToken: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dbOptions), AssetsModule],
    }).compile()

    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()
    adminAccessToken = await getUserAccessToken(app, "admin@example.com", "abcdef")
  })

  it(`should create and retrieve an assset using /assets POST and GET`, async () => {
    let res = await supertest(app.getHttpServer())
      .post(`/assets`)
      .send(exampleAssetBody)
      .set(...setAuthorization(adminAccessToken))
      .expect(201)
    expect(res.body).toEqual(expect.objectContaining(exampleAssetBody))
    res = await supertest(app.getHttpServer())
      .get(`/assets/${res.body.id}`)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    expect(res.body).toEqual(expect.objectContaining(exampleAssetBody))
    expect(res.body).toHaveProperty("id")
  })

  it(`should create, retrieve and delete an asset using /assets POST and DELETE`, async () => {
    const postRes = await supertest(app.getHttpServer())
      .post(`/assets`)
      .send(exampleAssetBody)
      .set(...setAuthorization(adminAccessToken))
      .expect(201)
    expect(postRes.body).toEqual(expect.objectContaining(exampleAssetBody))
    await supertest(app.getHttpServer())
      .get(`/assets/${postRes.body.id}`)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    await supertest(app.getHttpServer())
      .delete(`/assets/${postRes.body.id}`)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    await supertest(app.getHttpServer())
      .get(`/assets/${postRes.body.id}`)
      .set(...setAuthorization(adminAccessToken))
      .expect(404)
  })

  it(`should create and list an asset using /assets POST and GET`, async () => {
    const postRes = await supertest(app.getHttpServer())
      .post(`/assets`)
      .send(exampleAssetBody)
      .set(...setAuthorization(adminAccessToken))
      .expect(201)
    expect(postRes.body).toEqual(expect.objectContaining(exampleAssetBody))
    const listRes = await supertest(app.getHttpServer())
      .get(`/assets/`)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    expect(Array.isArray(listRes.body)).toBe(true)
    const filteredList = listRes.body.filter((value) => postRes.body.id === value.id)
    expect(filteredList.length).toEqual(1)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
