import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import supertest from "supertest"
import { applicationSetup } from "../../src/app.module"
import { AuthModule } from "../../src/auth/auth.module"
import { EmailService } from "../../src/shared/email/email.service"
import { getUserAccessToken } from "../utils/get-user-access-token"
import { setAuthorization } from "../utils/set-authorization-helper"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../../ormconfig.test")
import { ApplicationMethodsModule } from "../../src/application-methods/applications-methods.module"
import { ApplicationMethodType } from "../../src/application-methods/types/application-method-type-enum"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
jest.setTimeout(30000)

describe("ApplicationMethods", () => {
  let app: INestApplication
  let adminAccesstoken: string
  beforeAll(async () => {
    /* eslint-disable @typescript-eslint/no-empty-function */
    const testEmailService = { confirmation: async () => {} }
    /* eslint-enable @typescript-eslint/no-empty-function */
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dbOptions), AuthModule, ApplicationMethodsModule],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile()
    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()
    adminAccesstoken = await getUserAccessToken(app, "admin@example.com", "abcdef")
  })

  it(`should return applicationMethods`, async () => {
    const res = await supertest(app.getHttpServer())
      .get(`/applicationMethods`)
      .set(...setAuthorization(adminAccesstoken))
      .expect(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it(`should create and return a new application method`, async () => {
    const res = await supertest(app.getHttpServer())
      .post(`/applicationMethods`)
      .set(...setAuthorization(adminAccesstoken))
      .send({ type: ApplicationMethodType.ExternalLink })
      .expect(201)

    expect(res.body).toHaveProperty("id")
    expect(res.body).toHaveProperty("createdAt")
    expect(res.body).toHaveProperty("updatedAt")
    expect(res.body).toHaveProperty("type")
    expect(res.body.type).toBe(ApplicationMethodType.ExternalLink)

    const getById = await supertest(app.getHttpServer())
      .get(`/applicationMethods/${res.body.id}`)
      .set(...setAuthorization(adminAccesstoken))
      .expect(200)
    expect(getById.body.type).toBe(ApplicationMethodType.ExternalLink)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
