import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions from "../../ormconfig.test"
import supertest from "supertest"
import { applicationSetup } from "../../src/app.module"
import { AuthModule } from "../../src/auth/auth.module"
import { getUserAccessToken } from "../utils/get-user-access-token"
import { setAuthorization } from "../utils/set-authorization-helper"
import { MultiselectQuestionsModule } from "../../src/multiselect-question/multiselect-question.module"
import { MultiselectQuestionCreateDto } from "../../src/multiselect-question/dto/multiselect-question-create.dto"
import { EmailService } from "../../src/email/email.service"
import { ApplicationSection } from "../../src/multiselect-question/types/multiselect-application-section-enum"
import cookieParser from "cookie-parser"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
jest.setTimeout(30000)

describe("MultiselectQuestions", () => {
  let app: INestApplication
  let adminAccessToken: string

  beforeAll(async () => {
    /* eslint-disable @typescript-eslint/no-empty-function */
    const testEmailService = { confirmation: async () => {} }
    /* eslint-enable @typescript-eslint/no-empty-function */
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dbOptions), AuthModule, MultiselectQuestionsModule],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile()
    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    app.use(cookieParser())
    await app.init()
    adminAccessToken = await getUserAccessToken(app, "admin@example.com", "abcdef")
  })

  it(`should return questions`, async () => {
    const res = await supertest(app.getHttpServer())
      .get(`/multiselectQuestions`)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it(`should create and return a new question`, async () => {
    const newQuestion: MultiselectQuestionCreateDto = {
      text: "title",
      description: "description",
      subText: "subtitle",
      options: [],
      applicationSection: ApplicationSection.preferences,
    }
    const res = await supertest(app.getHttpServer())
      .post(`/multiselectQuestions`)
      .set(...setAuthorization(adminAccessToken))
      .send(newQuestion)
      .expect(201)
    expect(res.body).toHaveProperty("id")
    expect(res.body).toHaveProperty("createdAt")
    expect(res.body).toHaveProperty("updatedAt")
    expect(res.body.id).toBe(res.body.id)
    expect(res.body.text).toBe(newQuestion.text)

    const getById = await supertest(app.getHttpServer())
      .get(`/multiselectQuestions/${res.body.id}`)
      .expect(200)
    expect(getById.body.id).toBe(res.body.id)
    expect(getById.body.text).toBe(newQuestion.text)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
