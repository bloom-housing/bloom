import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm"
import supertest from "supertest"
import { applicationSetup } from "../../src/app.module"
import { AuthModule } from "../../src/auth/auth.module"
import { EmailService } from "../../src/shared/email/email.service"
import { getUserAccessToken } from "../utils/get-user-access-token"
import { setAuthorization } from "../utils/set-authorization-helper"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../../ormconfig.test")
import { AmiChartsModule } from "../../src/ami-charts/ami-charts.module"
import { AmiChartCreateDto } from "../../src/ami-charts/dto/ami-chart.dto"
import { Jurisdiction } from "../../src/jurisdictions/entities/jurisdiction.entity"
import { Repository } from "typeorm"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
jest.setTimeout(30000)

describe("AmiCharts", () => {
  let app: INestApplication
  let adminAccesstoken: string
  let jurisdictionRepository: Repository<Jurisdiction>
  beforeAll(async () => {
    /* eslint-disable @typescript-eslint/no-empty-function */
    const testEmailService = { confirmation: async () => {} }
    /* eslint-enable @typescript-eslint/no-empty-function */
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dbOptions),
        AuthModule,
        AmiChartsModule,
        TypeOrmModule.forFeature([Jurisdiction]),
      ],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile()
    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    jurisdictionRepository = app.get<Repository<Jurisdiction>>(getRepositoryToken(Jurisdiction))
    await app.init()
    adminAccesstoken = await getUserAccessToken(app, "admin@example.com", "abcdef")
  })

  it(`should return amiCharts`, async () => {
    const res = await supertest(app.getHttpServer())
      .get(`/amiCharts`)
      .set(...setAuthorization(adminAccesstoken))
      .expect(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(Array.isArray(res.body[0].items)).toBe(true)
    expect(res.body[0].items.length).toBeGreaterThan(0)
  })

  it(`should create and return a new ami chart`, async () => {
    const jurisdiction = (await jurisdictionRepository.find({ name: "Alameda" }))[0]
    const amiChartCreateDto: AmiChartCreateDto = {
      items: [
        {
          percentOfAmi: 50,
          householdSize: 5,
          income: 5000,
        },
      ],
      name: "testAmiChart",
      jurisdiction,
    }
    const res = await supertest(app.getHttpServer())
      .post(`/amiCharts`)
      .set(...setAuthorization(adminAccesstoken))
      .send(amiChartCreateDto)
      .expect(201)
    expect(res.body).toHaveProperty("id")
    expect(res.body).toHaveProperty("createdAt")
    expect(res.body).toHaveProperty("updatedAt")
    expect(res.body.name).toBe(amiChartCreateDto.name)

    const getById = await supertest(app.getHttpServer())
      .get(`/amiCharts/${res.body.id}`)
      .set(...setAuthorization(adminAccesstoken))
      .expect(200)
    expect(getById.body.name).toBe(amiChartCreateDto.name)
    expect(res.body.items.length).toBe(1)
    expect(res.body.items[0].percentOfAmi).toBe(amiChartCreateDto.items[0].percentOfAmi)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
