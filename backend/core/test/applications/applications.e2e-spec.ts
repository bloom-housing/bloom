import { Test } from "@nestjs/testing"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { getConnection } from "typeorm"
import { Application } from "../../src/entity/application.entity"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../../ormconfig.test")
import supertest from "supertest"
import { AppModule } from "../../src/app.module"
import { clearDb } from "../utils/clearDb"

describe("Applications", () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot(dbOptions),
        TypeOrmModule.forFeature([Application]),
      ],
    }).compile()
    await clearDb(getConnection())

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()
  })

  it(`/GET `, async () => {
    const res = await supertest(app.getHttpServer()).get("/applications").expect(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
