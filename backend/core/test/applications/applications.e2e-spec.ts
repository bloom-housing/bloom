import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import supertest from "supertest"
import { applicationSetup } from "../../src/app.module"
import { AuthModule } from "../../src/auth/auth.module"
import { ApplicationsModule } from "../../src/applications/applications.module"
import { ListingsModule } from "../../src/listings/listings.module"
import { EmailService } from "../../src/shared/email.service"
import { getUserAccessToken } from "../utils/get-user-access-token"
import { setAuthorization } from "../utils/set-authorization-helper"
import {
  Application,
  ApplicationStatus,
  ApplicationSubmissionType,
  ApplicationUpdate,
  IncomePeriod,
  Language,
} from "@bloom-housing/core"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../../ormconfig.test")

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

describe("Applications", () => {
  let app: INestApplication
  let user1AccessToken: string
  let user2AccessToken: string
  let adminAccessToken: string
  let listingId: string

  const getTestAppBody: () => ApplicationUpdate = () => {
    return {
      appUrl: "",
      listing: {
        id: listingId,
      },
      language: Language.en,
      status: ApplicationStatus.submitted,
      submissionType: ApplicationSubmissionType.electronical,
      acceptedTerms: false,
      applicant: {
        firstName: "Applicant",
        middleName: "Middlename",
        lastName: "",
        birthMonth: "",
        birthDay: "",
        birthYear: "",
        emailAddress: null,
        noEmail: false,
        phoneNumber: "",
        phoneNumberType: "",
        noPhone: false,
        workInRegion: null,
        address: {
          street: "",
          street2: "",
          city: "",
          state: "",
          zipCode: "",
          county: "",
          latitude: null,
          longitude: null,
        },
        workAddress: {
          street: "",
          street2: "",
          city: "",
          state: "",
          zipCode: "",
          county: "",
          latitude: null,
          longitude: null,
        },
      },
      additionalPhone: true,
      additionalPhoneNumber: "12345",
      additionalPhoneNumberType: "cell",
      contactPreferences: ["a", "b"],
      householdSize: 1,
      housingStatus: "status",
      sendMailToMailingAddress: true,
      mailingAddress: {
        street: "",
        street2: "",
        city: "",
        state: "",
        zipCode: "",
      },
      alternateAddress: {
        street: "",
        street2: "",
        city: "",
        state: "",
        zipCode: "",
      },
      alternateContact: {
        type: "",
        otherType: "",
        firstName: "",
        lastName: "",
        agency: "",
        phoneNumber: "",
        emailAddress: "",
        mailingAddress: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
        },
      },
      accessibility: {
        mobility: null,
        vision: null,
        hearing: null,
      },
      demographics: {
        ethnicity: "",
        race: "",
        gender: "",
        sexualOrientation: "",
        howDidYouHear: [],
      },
      incomeVouchers: true,
      income: "100.00",
      incomePeriod: IncomePeriod.perMonth,
      householdMembers: [],
      preferredUnit: ["a", "b"],
      preferences: {
        liveIn: false,
        none: false,
        workIn: false,
      },
    }
  }

  beforeAll(async () => {
    /* eslint-disable @typescript-eslint/no-empty-function */
    const testEmailService = { confirmation: async () => {} }
    /* eslint-enable @typescript-eslint/no-empty-function */
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dbOptions), AuthModule, ListingsModule, ApplicationsModule],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile()
    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()

    user1AccessToken = await getUserAccessToken(app, "test@example.com", "abcdef")

    user2AccessToken = await getUserAccessToken(app, "test2@example.com", "ghijkl")

    adminAccessToken = await getUserAccessToken(app, "admin@example.com", "abcdef")

    const res = await supertest(app.getHttpServer()).get("/listings").expect(200)
    listingId = res.body[0].id
  })

  it(`/GET `, async () => {
    const res = await supertest(app.getHttpServer())
      .get(`/applications`)
      .set(...setAuthorization(user1AccessToken))
      .expect(200)
    expect(Array.isArray(res.body.items)).toBe(true)
    expect(res.body.items.length).toBe(0)
  })

  it(`/POST `, async () => {
    const body = getTestAppBody()
    let res = await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(body)
      .set(...setAuthorization(user1AccessToken))
    expect(res.body).toMatchObject(body)
    expect(res.body).toHaveProperty("createdAt")
    expect(res.body).toHaveProperty("updatedAt")
    expect(res.body).toHaveProperty("id")
    res = await supertest(app.getHttpServer())
      .get(`/applications`)
      .set(...setAuthorization(user1AccessToken))
      .expect(200)
    expect(Array.isArray(res.body.items)).toBe(true)
    expect(res.body.items.length).toBe(1)
    expect(res.body.items[0]).toMatchObject(body)
  })

  it(`/GET by id`, async () => {
    const body = getTestAppBody()
    const createRes = await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(body)
      .set(...setAuthorization(user1AccessToken))
      .expect(201)
    expect(createRes.body).toMatchObject(body)
    expect(createRes.body).toHaveProperty("createdAt")
    expect(createRes.body).toHaveProperty("updatedAt")
    expect(createRes.body).toHaveProperty("id")
    const res = await supertest(app.getHttpServer())
      .get(`/applications/${createRes.body.id}`)
      .set(...setAuthorization(user1AccessToken))
      .expect(200)
    expect(res.body.id === createRes.body.id)
  })

  it(`/POST unauthenticated`, async () => {
    const body = getTestAppBody()
    const res = await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(body)
      .expect(201)
    expect(res.body).toMatchObject(body)
    expect(res.body).toHaveProperty("createdAt")
    expect(res.body).toHaveProperty("updatedAt")
    expect(res.body).toHaveProperty("id")
  })

  it(`/POST and search`, async () => {
    const body = getTestAppBody()
    body.applicant.firstName = "MyName"
    const createRes = await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(body)
      .expect(201)
    expect(createRes.body).toMatchObject(body)
    expect(createRes.body).toHaveProperty("createdAt")
    expect(createRes.body).toHaveProperty("updatedAt")
    expect(createRes.body).toHaveProperty("id")
    const res = await supertest(app.getHttpServer())
      .get(`/applications/?search=MyName`)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    expect(Array.isArray(res.body.items)).toBe(true)
    expect(res.body.items.length).toBe(1)
    expect(res.body.items[0].id === createRes.body.id)
    expect(res.body.items[0]).toMatchObject(createRes.body)
  })

  it(`/POST and CSV export`, async () => {
    const body = getTestAppBody()
    const createRes = await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(body)
      .expect(201)
    expect(createRes.body).toMatchObject(body)
    expect(createRes.body).toHaveProperty("createdAt")
    expect(createRes.body).toHaveProperty("updatedAt")
    expect(createRes.body).toHaveProperty("id")
    const res = await supertest(app.getHttpServer())
      .get(`/applications/csv/?includeHeaders=true`)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    expect(typeof res.body === "string")
  })

  it(`/DELETE `, async () => {
    const body = getTestAppBody()
    const createRes = await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(body)
      .set(...setAuthorization(user1AccessToken))
      .expect(201)
    await supertest(app.getHttpServer())
      .delete(`/applications/${createRes.body.id}`)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    await supertest(app.getHttpServer())
      .get(`/applications/${createRes.body.id}`)
      .set(...setAuthorization(user1AccessToken))
      .expect(404)
  })

  it(`/DELETE user 2 unauthorized to delete user 1 application`, async () => {
    const body = getTestAppBody()
    const createRes = await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(body)
      .set(...setAuthorization(user1AccessToken))
      .expect(201)
    await supertest(app.getHttpServer())
      .delete(`/applications/${createRes.body.id}`)
      .set(...setAuthorization(user2AccessToken))
      .expect(403)
  })

  it(`/PUT `, async () => {
    const body = getTestAppBody()
    const createRes = await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(body)
      .set(...setAuthorization(user1AccessToken))
      .expect(201)
    expect(createRes.body).toMatchObject(body)
    const newBody = getTestAppBody() as Application
    newBody.id = createRes.body.id
    // Because submission date is applied server side
    newBody.submissionDate = createRes.body.submissionDate
    const putRes = await supertest(app.getHttpServer())
      .put(`/applications/${createRes.body.id}`)
      .send(newBody)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    expect(putRes.body).toMatchObject(newBody)
  })

  it(`/PUT user 2 unauthorized to edit user 1 application`, async () => {
    const body = getTestAppBody()
    const createRes = await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(body)
      .set(...setAuthorization(user1AccessToken))
      .expect(201)
    expect(createRes.body).toMatchObject(body)
    const newBody = getTestAppBody() as Application
    newBody.id = createRes.body.id
    await supertest(app.getHttpServer())
      .put(`/applications/${createRes.body.id}`)
      .send(newBody)
      .set(...setAuthorization(user2AccessToken))
      .expect(403)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
