import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions from "../../ormconfig.test"
import supertest from "supertest"
import { applicationSetup } from "../../src/app.module"
import { AuthModule } from "../../src/auth/auth.module"
import { getUserAccessToken } from "../utils/get-user-access-token"
import { setAuthorization } from "../utils/set-authorization-helper"
import { JurisdictionsModule } from "../../src/jurisdictions/jurisdictions.module"
import { Repository } from "typeorm"
import { Language } from "../../src/shared/types/language-enum"
import { MultiselectQuestion } from "../../src/multiselect-question/entities/multiselect-question.entity"
import { EmailService } from "../../src/email/email.service"
import { ApplicationSection } from "../../src/multiselect-question/types/multiselect-application-section-enum"
import { MultiselectQuestionDto } from "../../src/multiselect-question/dto/multiselect-question.dto"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
jest.setTimeout(30000)

describe("Jurisdictions", () => {
  let app: INestApplication
  let adminAccesstoken: string
  let multiselectQuestionsRepository: Repository<MultiselectQuestion>

  beforeAll(async () => {
    /* eslint-disable @typescript-eslint/no-empty-function */
    const testEmailService = {
      confirmation: async () => {},
    }
    /* eslint-enable @typescript-eslint/no-empty-function */
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dbOptions),
        AuthModule,
        JurisdictionsModule,
        TypeOrmModule.forFeature([MultiselectQuestion]),
      ],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile()
    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()
    adminAccesstoken = await getUserAccessToken(app, "admin@example.com", "abcdef")
    multiselectQuestionsRepository = app.get<Repository<MultiselectQuestion>>(
      getRepositoryToken(MultiselectQuestion)
    )
  })

  it(`should return jurisdictions`, async () => {
    const res = await supertest(app.getHttpServer())
      .get(`/jurisdictions`)
      .set(...setAuthorization(adminAccesstoken))
      .expect(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it(`should create and return a new jurisdiction with a preference and a program`, async () => {
    const newPreference: MultiselectQuestionDto = await multiselectQuestionsRepository.save({
      text: "Preference Text",
      subText: "Preferece Subtext",
      description: "Preference Description",
      links: [],
      applicationSection: ApplicationSection.preferences,
    })
    const newProgram: MultiselectQuestionDto = await multiselectQuestionsRepository.save({
      text: "Program Text",
      subText: "Program Subtext",
      description: "Program Description",
      applicationSection: ApplicationSection.programs,
    })
    const res = await supertest(app.getHttpServer())
      .post(`/jurisdictions`)
      .set(...setAuthorization(adminAccesstoken))
      .send({
        name: "test",
        languages: [Language.en],
        multiselectQuestions: [newPreference, newProgram],
        publicUrl: "",
        emailFromAddress: "",
        rentalAssistanceDefault: "",
        enableAccessibilityFeatures: false,
        enableUtilitiesIncluded: false,
        enablePartnerSettings: false,
      })
      .expect(201)

    expect(res.body).toHaveProperty("id")
    expect(res.body).toHaveProperty("createdAt")
    expect(res.body).toHaveProperty("updatedAt")
    expect(res.body).toHaveProperty("name")
    expect(res.body).toHaveProperty("multiselectQuestions")
    expect(res.body.name).toBe("test")
    expect(Array.isArray(res.body.multiselectQuestions)).toBe(true)
    expect(res.body.multiselectQuestions.length).toBe(2)
    expect(res.body.multiselectQuestions[0].id).toBe(newPreference.id)
    expect(res.body.multiselectQuestions[1].id).toBe(newProgram.id)
    const getById = await supertest(app.getHttpServer())
      .get(`/jurisdictions/${res.body.id}`)
      .expect(200)
    expect(getById.body.name).toBe("test")
  })

  it(`should create and return a new jurisdiction by name`, async () => {
    const res = await supertest(app.getHttpServer())
      .post(`/jurisdictions`)
      .set(...setAuthorization(adminAccesstoken))
      .send({
        name: "test2",
        programs: [],
        languages: [Language.en],
        multiselectQuestions: [],
        publicUrl: "",
        emailFromAddress: "",
        rentalAssistanceDefault: "",
        enableAccessibilityFeatures: false,
        enableUtilitiesIncluded: false,
        enablePartnerSettings: false,
      })
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
    expect(getByName.body.languages[0]).toBe(Language.en)
  })

  it(`should not allow to create a jurisdiction with unsupported language`, async () => {
    await supertest(app.getHttpServer())
      .post(`/jurisdictions`)
      .set(...setAuthorization(adminAccesstoken))
      .send({ name: "test2", languages: ["non_existent_language"], emailFromAddress: "" })
      .expect(400)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
