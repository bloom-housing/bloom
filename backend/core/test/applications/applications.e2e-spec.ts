import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm"
import supertest from "supertest"
import { applicationSetup } from "../../src/app.module"
import { AuthModule } from "../../src/auth/auth.module"
import { ApplicationsModule } from "../../src/applications/applications.module"
import { ListingsModule } from "../../src/listings/listings.module"
import { EmailService } from "../../src/shared/email.service"
import { getUserAccessToken } from "../utils/get-user-access-token"
import { setAuthorization } from "../utils/set-authorization-helper"
import {
  ApplicationStatus,
  ApplicationSubmissionType,
  ApplicationUpdate,
  IncomePeriod,
  Language,
} from "@bloom-housing/backend-core/types"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../../ormconfig.test")
import { Repository } from "typeorm"
import { Application } from "../../src/applications/entities/application.entity"
import { UserDto } from "../../src/user/dto/user.dto"
import { ListingDto } from "../../src/listings/dto/listing.dto"
import { HouseholdMember } from "../../src/applications/entities/household-member.entity"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
jest.setTimeout(30000)

describe("Applications", () => {
  let app: INestApplication
  let user1AccessToken: string
  let user2AccessToken: string
  let adminAccessToken: string
  let leasingAgent1AccessToken: string
  let leasingAgent1Profile: UserDto
  let leasingAgent2AccessToken: string
  let leasingAgent2Profile: UserDto
  let applicationsRepository: Repository<Application>
  let householdMembersRepository: Repository<HouseholdMember>
  let listing1Id: string
  let listing2Id: string

  const getTestAppBody: (listingId?: string) => ApplicationUpdate = (listingId?: string) => {
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
        emailAddress: "alternate@contact.com",
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
      imports: [
        TypeOrmModule.forRoot(dbOptions),
        AuthModule,
        ListingsModule,
        ApplicationsModule,
        TypeOrmModule.forFeature([Application, HouseholdMember]),
      ],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile()
    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()
    applicationsRepository = app.get<Repository<Application>>(getRepositoryToken(Application))
    householdMembersRepository = app.get<Repository<HouseholdMember>>(
      getRepositoryToken(HouseholdMember)
    )

    user1AccessToken = await getUserAccessToken(app, "test@example.com", "abcdef")

    user2AccessToken = await getUserAccessToken(app, "test2@example.com", "ghijkl")

    adminAccessToken = await getUserAccessToken(app, "admin@example.com", "abcdef")

    leasingAgent1AccessToken = await getUserAccessToken(
      app,
      "leasing-agent-1@example.com",
      "abcdef"
    )

    leasingAgent2AccessToken = await getUserAccessToken(
      app,
      "leasing-agent-2@example.com",
      "abcdef"
    )

    leasingAgent1Profile = (
      await supertest(app.getHttpServer())
        .get(`/user`)
        .set(...setAuthorization(leasingAgent1AccessToken))
        .expect(200)
    ).body

    leasingAgent2Profile = (
      await supertest(app.getHttpServer())
        .get(`/user`)
        .set(...setAuthorization(leasingAgent2AccessToken))
        .expect(200)
    ).body

    const res = await supertest(app.getHttpServer()).get("/listings").expect(200)
    // Finding listings corresponding to leasing agents (permission wise)
    listing1Id = res.body.filter((listing: ListingDto) => {
      const leasingAgentsIds = listing.leasingAgents.map((agent) => agent.id)
      return leasingAgentsIds.indexOf(leasingAgent1Profile.id) !== -1
    })[0].id
    listing2Id = res.body.filter((listing: ListingDto) => {
      const leasingAgentsIds = listing.leasingAgents.map((agent) => agent.id)
      return leasingAgentsIds.indexOf(leasingAgent2Profile.id) !== -1
    })[0].id
  })

  beforeEach(async () => {
    await householdMembersRepository.createQueryBuilder().delete().execute()
    await applicationsRepository.createQueryBuilder().delete().execute()
  })

  it(`should allow a user to create and read his own application `, async () => {
    const body = getTestAppBody(listing1Id)
    let res = await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(body)
      .set(...setAuthorization(user1AccessToken))
      .expect(201)
    expect(res.body).toMatchObject(body)
    expect(res.body).toHaveProperty("createdAt")
    expect(res.body).toHaveProperty("updatedAt")
    expect(res.body).toHaveProperty("id")
    res = await supertest(app.getHttpServer())
      .get(`/applications/${res.body.id}`)
      .set(...setAuthorization(user1AccessToken))
      .expect(200)
    expect(res.body).toMatchObject(body)
    res = await supertest(app.getHttpServer())
      .get(`/applications`)
      .set(...setAuthorization(user1AccessToken))
      .expect(200)
    expect(Array.isArray(res.body.items)).toBe(true)
    expect(res.body.items.length).toBe(1)
    expect(res.body.items[0]).toMatchObject(body)
  })

  it(`should not allow leasing agents to list all applications, but should allow to list owned`, async () => {
    const listing1Application = getTestAppBody(listing1Id)
    const app1 = await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(listing1Application)
      .set(...setAuthorization(user1AccessToken))
      .expect(201)
    const listing2Application = getTestAppBody(listing2Id)
    const app2 = await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(listing2Application)
      .set(...setAuthorization(user2AccessToken))
      .expect(201)

    await supertest(app.getHttpServer())
      .get(`/applications`)
      .set(...setAuthorization(leasingAgent1AccessToken))
      .expect(403)

    const appsForListing1 = await supertest(app.getHttpServer())
      .get(`/applications?listingId=${listing1Id}`)
      .set(...setAuthorization(leasingAgent1AccessToken))
      .expect(200)
    expect(Array.isArray(appsForListing1.body.items)).toBe(true)
    expect(appsForListing1.body.items.length).toBe(1)
    expect(appsForListing1.body.items[0].id).toBe(app1.body.id)

    const appsForListing2 = await supertest(app.getHttpServer())
      .get(`/applications?listingId=${listing2Id}`)
      .set(...setAuthorization(leasingAgent2AccessToken))
      .expect(200)
    expect(Array.isArray(appsForListing2.body.items)).toBe(true)
    expect(appsForListing2.body.items.length).toBe(1)
    expect(appsForListing2.body.items[0].id).toBe(app2.body.id)

    await supertest(app.getHttpServer())
      .get(`/applications?listingId=${listing2Id}`)
      .set(...setAuthorization(leasingAgent1AccessToken))
      .expect(403)
  })

  it(`should only allow leasing agents to POST/PUT /applications for listings they are assigned to`, async () => {
    const listing1Application = getTestAppBody(listing1Id)
    const listing2Application = getTestAppBody(listing2Id)
    const res = await supertest(app.getHttpServer())
      .post(`/applications`)
      .send(listing1Application)
      .set(...setAuthorization(leasingAgent1AccessToken))
      .expect(201)
    await supertest(app.getHttpServer())
      .post(`/applications`)
      .send(listing2Application)
      .set(...setAuthorization(leasingAgent1AccessToken))
      .expect(403)
    await supertest(app.getHttpServer())
      .put(`/applications/${res.body.id}`)
      .send(res.body)
      .set(...setAuthorization(leasingAgent1AccessToken))
      .expect(200)
    await supertest(app.getHttpServer())
      .put(`/applications/${res.body.id}`)
      .send(res.body)
      .set(...setAuthorization(leasingAgent2AccessToken))
      .expect(403)
  })

  it(`should allow admin to list all`, async () => {
    const app1Body = getTestAppBody(listing1Id)
    await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(app1Body)
      .set(...setAuthorization(user1AccessToken))
      .expect(201)
    const app2Body = getTestAppBody(listing2Id)
    await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(app2Body)
      .set(...setAuthorization(user2AccessToken))
      .expect(201)
    const res = await supertest(app.getHttpServer())
      .get(`/applications`)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    expect(Array.isArray(res.body.items)).toBe(true)
    expect(res.body.items.length).toBe(2)
  })

  it(`should allow a leasing agent to list all for specific list`, async () => {
    const body = getTestAppBody(listing1Id)
    await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(body)
      .set(...setAuthorization(user1AccessToken))
      .expect(201)
    await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(body)
      .set(...setAuthorization(user2AccessToken))
      .expect(201)
    const res = await supertest(app.getHttpServer())
      .get(`/applications?listingId=${listing1Id}`)
      .set(...setAuthorization(leasingAgent1AccessToken))
      .expect(200)
    expect(Array.isArray(res.body.items)).toBe(true)
    expect(res.body.items.length).toBe(2)
  })

  it(`should allow a user to create and retrieve by ID his own application`, async () => {
    const body = getTestAppBody(listing1Id)
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

  it(`should allow unauthenticated user to create an application, but not allow to retrieve it by id`, async () => {
    const body = getTestAppBody(listing1Id)
    const res = await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(body)
      .expect(201)
    expect(res.body).toMatchObject(body)
    expect(res.body).toHaveProperty("createdAt")
    expect(res.body).toHaveProperty("updatedAt")
    expect(res.body).toHaveProperty("id")
    await supertest(app.getHttpServer()).get(`/applications/${res.body.id}`).expect(403)
  })

  it(`should allow an admin to search for users application using search query param`, async () => {
    const body = getTestAppBody(listing1Id)
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

  it(`should allow exporting applications as CSV`, async () => {
    const body = getTestAppBody(listing1Id)
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

  it(`should allow an admin to delete user's applications`, async () => {
    const body = getTestAppBody(listing1Id)
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

  it(`should disallow users to delete their own applications`, async () => {
    const body = getTestAppBody(listing1Id)
    const createRes = await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(body)
      .set(...setAuthorization(user1AccessToken))
      .expect(201)
    await supertest(app.getHttpServer())
      .delete(`/applications/${createRes.body.id}`)
      .set(...setAuthorization(user1AccessToken))
      .expect(403)
  })

  it(`should disallow users to edit their own applications`, async () => {
    const body = getTestAppBody(listing1Id)
    const createRes = await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(body)
      .set(...setAuthorization(user1AccessToken))
      .expect(201)
    await supertest(app.getHttpServer())
      .put(`/applications/${createRes.body.id}`)
      .send(body)
      .set(...setAuthorization(user1AccessToken))
      .expect(403)
  })

  it(`should allow an admin to edit user's application`, async () => {
    const body = getTestAppBody(listing1Id)
    const createRes = await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(body)
      .set(...setAuthorization(user1AccessToken))
      .expect(201)
    expect(createRes.body).toMatchObject(body)
    const newBody = getTestAppBody(listing1Id) as Application
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

  it(`should disallow users editing applications of other users`, async () => {
    const body = getTestAppBody(listing1Id)
    const createRes = await supertest(app.getHttpServer())
      .post(`/applications/submit`)
      .send(body)
      .set(...setAuthorization(user1AccessToken))
      .expect(201)
    expect(createRes.body).toMatchObject(body)
    const newBody = getTestAppBody(listing1Id) as Application
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
