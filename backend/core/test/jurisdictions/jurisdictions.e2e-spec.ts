import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../../ormconfig.test")
import supertest from "supertest"
import { applicationSetup } from "../../src/app.module"
import { AuthModule } from "../../src/auth/auth.module"
import { EmailService } from "../../src/shared/email/email.service"
import { getUserAccessToken } from "../utils/get-user-access-token"
import { setAuthorization } from "../utils/set-authorization-helper"
import { JurisdictionsModule } from "../../src/jurisdictions/jurisdictions.module"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
jest.setTimeout(30000)

describe("Jurisdictions", () => {
  let app: INestApplication
  let adminAccesstoken: string
  beforeAll(async () => {
    /* eslint-disable @typescript-eslint/no-empty-function */
    const testEmailService = { confirmation: async () => {} }
    /* eslint-enable @typescript-eslint/no-empty-function */
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dbOptions), AuthModule, JurisdictionsModule],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile()
    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()
    adminAccesstoken = await getUserAccessToken(app, "admin@example.com", "abcdef")
  })

  it(`should return jurisdictions`, async () => {
    const res = await supertest(app.getHttpServer())
      .get(`/jurisdictions`)
      .set(...setAuthorization(adminAccesstoken))
      .expect(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it(`should create and return a new jurisdiction`, async () => {
    const res = await supertest(app.getHttpServer())
      .post(`/jurisdictions`)
      .set(...setAuthorization(adminAccesstoken))
      .send({ name: "test" })
      .expect(201)
    expect(res.body).toHaveProperty("id")
    expect(res.body).toHaveProperty("createdAt")
    expect(res.body).toHaveProperty("updatedAt")
    expect(res.body).toHaveProperty("name")
    expect(res.body.name).toBe("test")

    const getById = await supertest(app.getHttpServer())
      .get(`/jurisdictions/${res.body.id}`)
      .expect(200)
    expect(getById.body.name).toBe("test")
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })

  it(`should create and return a new jurisdiction by name`, async () => {
    const res = await supertest(app.getHttpServer())
      .post(`/jurisdictions`)
      .set(...setAuthorization(adminAccesstoken))
      .send({ name: "test2" })
      .expect(201)
    expect(res.body).toHaveProperty("id")
    expect(res.body).toHaveProperty("createdAt")
    expect(res.body).toHaveProperty("updatedAt")
    expect(res.body).toHaveProperty("name")
    expect(res.body.name).toBe("test2")

    const getByName = await supertest(app.getHttpServer())
      .get(`/jurisdictions/byName/${res.body.name}`)
      .expect(200)
    expect(getByName.body.name).toBe("test2")
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
