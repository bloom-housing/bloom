import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import supertest from "supertest"
import { applicationSetup } from "../../src/app.module"
import { AuthModule } from "../../src/auth/auth.module"
import { getUserAccessToken } from "../utils/get-user-access-token"
import { setAuthorization } from "../utils/set-authorization-helper"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../../ormconfig.test")
import { UnitRentTypesModule } from "../../src/unit-rent-types/unit-rent-types.module"
import { EmailService } from "../../src/email/email.service"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
jest.setTimeout(30000)

describe("UnitRentTypes", () => {
  let app: INestApplication
  let adminAccesstoken: string
  beforeAll(async () => {
    /* eslint-disable @typescript-eslint/no-empty-function */
    const testEmailService = { confirmation: async () => {} }
    /* eslint-enable @typescript-eslint/no-empty-function */
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dbOptions), AuthModule, UnitRentTypesModule],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile()
    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()
    adminAccesstoken = await getUserAccessToken(app, "admin@example.com", "abcdef")
  })

  it(`should return unitRentTypes`, async () => {
    const res = await supertest(app.getHttpServer())
      .get(`/unitRentTypes`)
      .set(...setAuthorization(adminAccesstoken))
      .expect(200)
    expect(Array.isArray(res.body)).toBe(true)

    const unitRentTypes = res.body.map((unitRentTypes) => unitRentTypes.name)
    for (const predefinedUnitRentType of ["fixed", "percentageOfIncome"]) {
      expect(unitRentTypes).toContain(predefinedUnitRentType)
    }
  })

  it(`should create and return a new unit rent type`, async () => {
    const unitRentTypesName = "new unit rent type"
    const res = await supertest(app.getHttpServer())
      .post(`/unitRentTypes`)
      .set(...setAuthorization(adminAccesstoken))
      .send({ name: unitRentTypesName })
      .expect(201)
    expect(res.body).toHaveProperty("id")
    expect(res.body).toHaveProperty("createdAt")
    expect(res.body).toHaveProperty("updatedAt")
    expect(res.body).toHaveProperty("name")
    expect(res.body.name).toBe(unitRentTypesName)

    const getById = await supertest(app.getHttpServer())
      .get(`/unitRentTypes/${res.body.id}`)
      .set(...setAuthorization(adminAccesstoken))
      .expect(200)
    expect(getById.body.name).toBe(unitRentTypesName)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
