import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../../ormconfig.test")
import supertest from "supertest"
import { applicationSetup } from "../../src/app.module"
import { AssetsModule } from "../../src/assets/assets.module"
import { AssetCreateDto } from "../../src/assets/asset.create.dto"
import { plainToClass } from "class-transformer"
import { validateOrReject, ValidationError } from "class-validator"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

const exampleAssetBody = {
  fileId:
    "https://regional-dahlia-staging.s3-us-west-1.amazonaws.com/listings/archer/archer-studios.jpg",
  label: "building",
  referenceId: "Uvbk5qurpB2WI9V6WnNdH",
  referenceType: "Listing",
}

describe("Assets", () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AssetsModule, TypeOrmModule.forRoot(dbOptions)],
    }).compile()
    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()
  })

  it(`should create and retrieve an assset using /assets POST and GET`, async () => {
    let res = await supertest(app.getHttpServer())
      .post(`/assets`)
      .send(exampleAssetBody)
      .expect(201)
    expect(res.body).toEqual(expect.objectContaining(exampleAssetBody))
    res = await supertest(app.getHttpServer()).get(`/assets/${res.body.id}`).expect(200)
    expect(res.body).toEqual(expect.objectContaining(exampleAssetBody))
    expect(res.body).toHaveProperty("id")
  })

  it(`should create, retrieve and delete an asset using /assets POST and DELETE`, async () => {
    const postRes = await supertest(app.getHttpServer())
      .post(`/assets`)
      .send(exampleAssetBody)
      .expect(201)
    expect(postRes.body).toEqual(expect.objectContaining(exampleAssetBody))
    await supertest(app.getHttpServer()).get(`/assets/${postRes.body.id}`).expect(200)
    await supertest(app.getHttpServer()).delete(`/assets/${postRes.body.id}`).expect(200)
    await supertest(app.getHttpServer()).get(`/assets/${postRes.body.id}`).expect(404)
  })

  it(`should create and list an asset using /assets POST and GET`, async () => {
    const postRes = await supertest(app.getHttpServer())
      .post(`/assets`)
      .send(exampleAssetBody)
      .expect(201)
    expect(postRes.body).toEqual(expect.objectContaining(exampleAssetBody))
    const listRes = await supertest(app.getHttpServer()).get(`/assets/`).expect(200)
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
