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
import { Language } from "../../src/shared/types/language-enum"
import { PaperApplicationsModule } from "../../src/paper-applications/paper-applications.module"
import { AssetsModule } from "../../src/assets/assets.module"
import { EmailService } from "../../src/email/email.service"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
jest.setTimeout(30000)

describe("PaperApplications", () => {
  let app: INestApplication
  let adminAccesstoken: string
  beforeAll(async () => {
    /* eslint-disable @typescript-eslint/no-empty-function */
    const testEmailService = { confirmation: async () => {} }
    /* eslint-enable @typescript-eslint/no-empty-function */
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dbOptions),
        AuthModule,
        PaperApplicationsModule,
        AssetsModule,
      ],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile()
    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()
    adminAccesstoken = await getUserAccessToken(app, "admin@example.com", "abcdef")
  })

  it(`should return paperApplications`, async () => {
    const res = await supertest(app.getHttpServer())
      .get(`/paperApplications`)
      .set(...setAuthorization(adminAccesstoken))
      .expect(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
  // TODO: paper applications are only creatable through a listing
  it.skip(`should create and return a new paper application`, async () => {
    const asset = await supertest(app.getHttpServer())
      .post(`/assets`)
      .set(...setAuthorization(adminAccesstoken))
      .send({ fileId: "testFileId", label: "testLabel" })
      .expect(201)

    const res = await supertest(app.getHttpServer())
      .post(`/paperApplications`)
      .set(...setAuthorization(adminAccesstoken))
      .send({ language: Language.en, file: { id: asset.body.id } })
      .expect(201)
    expect(res.body).toHaveProperty("id")
    expect(res.body).toHaveProperty("createdAt")
    expect(res.body).toHaveProperty("updatedAt")
    expect(res.body).toHaveProperty("language")
    expect(res.body.language).toBe(Language.en)

    const getById = await supertest(app.getHttpServer())
      .get(`/paperApplications/${res.body.id}`)
      .set(...setAuthorization(adminAccesstoken))
      .expect(200)
    expect(getById.body.language).toBe(Language.en)
    expect(getById.body.file.id).toBe(asset.body.id)
    expect(getById.body.file.fileId).toBe("testFileId")
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
