import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../../ormconfig.test")
import supertest from "supertest"
import { applicationSetup } from "../../src/app.module"
import { AuthModule } from "../../src/auth/auth.module"
import { EmailService } from "../../src/shared/email/email.service"
import { getUserAccessToken } from "../utils/get-user-access-token"
import { setAuthorization } from "../utils/set-authorization-helper"
import { ReservedCommunityTypesModule } from "../../src/reserved-community-type/reserved-community-types.module"
import { JurisdictionsModule } from "../../src/jurisdictions/jurisdictions.module"
import { Jurisdiction } from "../../src/jurisdictions/entities/jurisdiction.entity"
import { Repository } from "typeorm"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
jest.setTimeout(30000)

describe("ReservedCommunityTypes", () => {
  let app: INestApplication
  let adminAccesstoken: string
  let jurisdictionsRepository: Repository<Jurisdiction>
  beforeAll(async () => {
    /* eslint-disable @typescript-eslint/no-empty-function */
    const testEmailService = { confirmation: async () => {} }
    /* eslint-enable @typescript-eslint/no-empty-function */
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dbOptions),
        AuthModule,
        ReservedCommunityTypesModule,
        JurisdictionsModule,
      ],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile()
    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()
    adminAccesstoken = await getUserAccessToken(app, "admin@example.com", "abcdef")
    jurisdictionsRepository = app.get<Repository<Jurisdiction>>(getRepositoryToken(Jurisdiction))
  })

  it(`should return reservedCommunityTypes`, async () => {
    const res = await supertest(app.getHttpServer())
      .get(`/reservedCommunityTypes`)
      .set(...setAuthorization(adminAccesstoken))
      .expect(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it(`should create and return a new reserved community type`, async () => {
    const jurisdiction = (await jurisdictionsRepository.find())[0]
    const res = await supertest(app.getHttpServer())
      .post(`/reservedCommunityTypes`)
      .set(...setAuthorization(adminAccesstoken))
      .send({ name: "test", description: "description", jurisdiction })
      .expect(201)
    expect(res.body).toHaveProperty("id")
    expect(res.body).toHaveProperty("createdAt")
    expect(res.body).toHaveProperty("updatedAt")
    expect(res.body).toHaveProperty("name")
    expect(res.body).toHaveProperty("description")
    expect(res.body.name).toBe("test")
    expect(res.body.description).toBe("description")
    expect(res.body.jurisdiction.id).toBe(jurisdiction.id)

    const getById = await supertest(app.getHttpServer())
      .get(`/reservedCommunityTypes/${res.body.id}`)
      .set(...setAuthorization(adminAccesstoken))
      .expect(200)
    expect(getById.body.name).toBe("test")
    expect(getById.body.description).toBe("description")
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
