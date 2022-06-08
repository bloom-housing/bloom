import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions from "../../ormconfig.test"

import supertest from "supertest"
import { applicationSetup, AppModule } from "../../src/app.module"
import { getUserAccessToken } from "../utils/get-user-access-token"
import { setAuthorization } from "../utils/set-authorization-helper"
import { UserDto } from "../../src/auth/dto/user.dto"
import { v4 as uuidv4 } from "uuid"
import { DeepPartial, Repository } from "typeorm"
import { Application } from "../../src/applications/entities/application.entity"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Listing } from "../../src/listings/entities/listing.entity"
import { ApplicationDto } from "../../src/applications/dto/application.dto"
import { Jurisdiction } from "../../src/jurisdictions/entities/jurisdiction.entity"
import * as uuid from "uuid"
import { User } from "../../src/auth/entities/user.entity"
import { PasswordService } from "../../src/auth/services/password.service"
import { makeTestListing } from "../utils/make-test-listing"
import { UserInviteDto } from "../../src/auth/dto/user-invite.dto"
import { Translation } from "../../src/translations/entities/translation.entity"
import { EmailService } from "../../src/email/email.service"
import { getTestAppBody } from "../lib/get-test-app-body"

jest.setTimeout(30000)

describe("Authz", () => {
  let app: INestApplication
  let userAccessToken: string
  let adminAccessToken: string
  let userProfile: UserDto
  const adminOnlyEndpoints = ["/preferences", "/units", "/translations"]
  const applicationsEndpoint = "/applications"
  const listingsEndpoint = "/listings"
  const userEndpoint = "/user"
  let applicationsRepository: Repository<Application>
  let listingsRepository: Repository<Listing>
  let jurisdictionsRepository: Repository<Jurisdiction>
  let usersRepository: Repository<User>
  let passwordService: PasswordService
  let translationsRepository: Repository<Translation>
  let app1: ApplicationDto
  let listing1Id: string

  beforeAll(async () => {
    const testEmailService = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      invite: async () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      confirmation: async () => {},
    }

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule.register(dbOptions)],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile()

    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()

    userAccessToken = await getUserAccessToken(app, "test@example.com", "abcdef")
    adminAccessToken = await getUserAccessToken(app, "admin@example.com", "abcdef")

    userProfile = (
      await supertest(app.getHttpServer())
        .get("/user")
        .set(...setAuthorization(userAccessToken))
    ).body

    applicationsRepository = app.get<Repository<Application>>(getRepositoryToken(Application))
    listingsRepository = app.get<Repository<Listing>>(getRepositoryToken(Listing))
    jurisdictionsRepository = app.get<Repository<Jurisdiction>>(getRepositoryToken(Jurisdiction))
    translationsRepository = app.get<Repository<Translation>>(getRepositoryToken(Translation))
    usersRepository = app.get<Repository<User>>(getRepositoryToken(User))
    passwordService = app.get<PasswordService>(PasswordService)

    const listings = await listingsRepository.find({ take: 1 })
    listing1Id = listings[0].id

    const listing1Application = getTestAppBody(listing1Id)
    app1 = (
      await supertest(app.getHttpServer())
        .post(`/applications/submit`)
        .send(listing1Application)
        .set("jurisdictionName", "Alameda")
        .set(...setAuthorization(userAccessToken))
        .expect(201)
    ).body
    console.log(app1)
  })

  describe("admin endpoints", () => {
    it(`should not allow normal/anonymous user to GET to admin only endpoints`, async () => {
      for (const endpoint of adminOnlyEndpoints) {
        // anonymous
        await supertest(app.getHttpServer()).get(endpoint).expect(403)
        // logged in normal user
        await supertest(app.getHttpServer())
          .get(endpoint)
          .set(...setAuthorization(userAccessToken))
          .expect(403)
      }
    })
    it(`should not allow normal/anonymous user to GET/:id to admin only endpoints`, async () => {
      for (const endpoint of adminOnlyEndpoints) {
        // anonymous
        await supertest(app.getHttpServer())
          .get(endpoint + `/${uuidv4()}`)
          .expect(403)
        // logged in normal user
        await supertest(app.getHttpServer())
          .get(endpoint + `/${uuidv4()}`)
          .set(...setAuthorization(userAccessToken))
          .expect(403)
      }
    })
    it(`should not allow normal/anonymous user to POST to admin only endpoints`, async () => {
      for (const endpoint of adminOnlyEndpoints) {
        // anonymous
        await supertest(app.getHttpServer()).post(endpoint).send({}).expect(403)
        // logged in normal user
        await supertest(app.getHttpServer())
          .post(endpoint)
          .send({})
          .set(...setAuthorization(userAccessToken))
          .expect(403)
      }
    })
    it(`should not allow normal/anonymous user to PUT to admin only endpoints`, async () => {
      for (const endpoint of adminOnlyEndpoints) {
        // anonymous
        await supertest(app.getHttpServer())
          .put(endpoint + `/${uuidv4()}`)
          .send({})
          .expect(403)
        // logged in normal user
        await supertest(app.getHttpServer())
          .put(endpoint + `/${uuidv4()}`)
          .send({})
          .set(...setAuthorization(userAccessToken))
          .expect(403)
      }
    })
    it(`should not allow normal/anonymous user to DELETE to admin only endpoints`, async () => {
      for (const endpoint of adminOnlyEndpoints) {
        // anonymous
        await supertest(app.getHttpServer())
          .delete(endpoint + `/${uuidv4()}`)
          .expect(403)
        // logged in normal user
        await supertest(app.getHttpServer())
          .delete(endpoint + `/${uuidv4()}`)
          .set(...setAuthorization(userAccessToken))
          .expect(403)
      }
    })
  })

  describe("user", () => {
    it(`should not allow anonymous user to GET to get any user profile`, async () => {
      await supertest(app.getHttpServer()).get(userEndpoint).expect(401)
    })

    it(`should allow a logged in user to GET to get any user profile`, async () => {
      await supertest(app.getHttpServer())
        .get(userEndpoint)
        .set(...setAuthorization(userAccessToken))
        .expect(200)
    })

    it(`should allow anonymous user to CREATE a user`, async () => {
      await supertest(app.getHttpServer()).post(userEndpoint).expect(400)
    })
  })

  describe("applications", () => {
    it("should not allow anonymous user to GET applications", async () => {
      await supertest(app.getHttpServer()).get(applicationsEndpoint).expect(403)
    })
    it("should allow logged in user to GET applications", async () => {
      await supertest(app.getHttpServer())
        .get(applicationsEndpoint + `?userId=${userProfile.id}`)
        .set(...setAuthorization(userAccessToken))
        .expect(200)
    })
    it("should not allow anonymous user to GET CSV applications", async () => {
      await supertest(app.getHttpServer())
        .get(applicationsEndpoint + "/csv")
        .expect(403)
    })
    it("should not allow anonymous user to GET applications by ID", async () => {
      const applications = await applicationsRepository.find({ take: 1 })
      await supertest(app.getHttpServer())
        .get(applicationsEndpoint + `/${applications[0].id}`)
        .expect(403)
    })
    it(`should not allow normal/anonymous user to DELETE applications`, async () => {
      // anonymous
      const applications = await applicationsRepository.find({ take: 1 })
      await supertest(app.getHttpServer())
        .delete(applicationsEndpoint + `/${applications[0].id}`)
        .expect(403)
      // logged in normal user
      await supertest(app.getHttpServer())
        .delete(applicationsEndpoint + `/${applications[0].id}`)
        .set(...setAuthorization(userAccessToken))
        .expect(403)
    })
    it(`should not allow normal/anonymous user to PUT applications`, async () => {
      // anonymous
      await supertest(app.getHttpServer())
        .put(applicationsEndpoint + `/${app1.id}`)
        .send(app1)
        .expect(403)

      // logged in normal user
      await supertest(app.getHttpServer())
        .put(applicationsEndpoint + `/${app1.id}`)
        .set(...setAuthorization(userAccessToken))
        .send(app1)
        .expect(403)
    })
    it(`should allow normal/anonymous user to POST applications`, async () => {
      // anonymous
      await supertest(app.getHttpServer())
        .post(applicationsEndpoint + "/submit")
        .expect(400)
      // logged in normal user
      await supertest(app.getHttpServer())
        .post(applicationsEndpoint + "/submit")
        .set(...setAuthorization(userAccessToken))
        .expect(400)
    })
  })
  describe("listings", () => {
    it("should allow anonymous user to GET listings", async () => {
      await supertest(app.getHttpServer()).get(listingsEndpoint).expect(200)
    })
    it("should allow anonymous user to GET listings by ID", async () => {
      const res = await supertest(app.getHttpServer()).get(listingsEndpoint).expect(200)
      await supertest(app.getHttpServer())
        .get(`${listingsEndpoint}/${res.body.items[0].id}`)
        .expect(200)
    })
    it(`should not allow normal/anonymous user to DELETE listings`, async () => {
      // anonymous
      await supertest(app.getHttpServer())
        .delete(listingsEndpoint + `/${listing1Id}`)
        .expect(403)
      // logged in normal user
      await supertest(app.getHttpServer())
        .delete(listingsEndpoint + `/${listing1Id}`)
        .set(...setAuthorization(userAccessToken))
        .expect(403)
    })
    it(`should not allow normal/anonymous user to PUT listings`, async () => {
      // anonymous
      await supertest(app.getHttpServer())
        .put(listingsEndpoint + `/${listing1Id}`)
        .send({ id: listing1Id })
        .expect(403)

      // logged in normal user
      await supertest(app.getHttpServer())
        .put(listingsEndpoint + `/${listing1Id}`)
        .send({ id: listing1Id })
        .set(...setAuthorization(userAccessToken))
        .expect(403)
    })
    it(`should not allow normal/anonymous user to POST listings`, async () => {
      const anyJurisdiction = (await jurisdictionsRepository.find({ take: 1 }))[0]

      // anonymous
      await supertest(app.getHttpServer())
        .post(listingsEndpoint)
        .send({ jurisdiction: { id: anyJurisdiction.id } })
        .expect(403)

      // logged in normal user
      await supertest(app.getHttpServer())
        .post(listingsEndpoint)
        .send({ jurisdiction: { id: anyJurisdiction.id } })
        .set(...setAuthorization(userAccessToken))
        .expect(403)
    })

    it(`should not allow normal user to change it's role`, async () => {
      let profileRes = await supertest(app.getHttpServer())
        .get("/user")
        .set(...setAuthorization(userAccessToken))
        .expect(200)

      expect(profileRes.body.roles).toBe(null)
      await supertest(app.getHttpServer())
        .put(`/userProfile/${profileRes.body.id}`)
        .send({ ...profileRes.body, roles: { isAdmin: true, isPartner: false } })
        .set(...setAuthorization(userAccessToken))
        .expect(200)

      profileRes = await supertest(app.getHttpServer())
        .get("/user")
        .set(...setAuthorization(userAccessToken))
        .expect(200)

      expect(profileRes.body.roles).toBe(null)
    })
  })

  describe("jurisdictional admin permissions", () => {
    it("can add/view/edit all listings within their jurisdiction", async () => {
      const jurisdiction = await jurisdictionsRepository.save({
        name: `j-${uuid.v4()}`,
        rentalAssistanceDefault: "",
      })

      const password = "abcdef"
      const createJurisdictionalAdminDto: DeepPartial<User> = {
        email: `j-admin-${uuid.v4()}@example.com`,
        firstName: "first",
        middleName: "mid",
        lastName: "last",
        dob: new Date(),
        passwordHash: await passwordService.passwordToHash(password),
        jurisdictions: [jurisdiction],
        confirmedAt: new Date(),
        mfaEnabled: false,
        roles: { isJurisdictionalAdmin: true },
      }

      await usersRepository.save(createJurisdictionalAdminDto)

      const jurisdictionalAdminAccessToken = await getUserAccessToken(
        app,
        createJurisdictionalAdminDto.email,
        password
      )

      const newListingCreateDto = makeTestListing(jurisdiction.id)
      let listingResponse = await supertest(app.getHttpServer())
        .post(`/listings`)
        .send(newListingCreateDto)
        .set(...setAuthorization(jurisdictionalAdminAccessToken))
        .expect(201)
      expect(listingResponse.body.jurisdiction.id).toBe(jurisdiction.id)

      listingResponse = await supertest(app.getHttpServer())
        .get(`/listings/${listingResponse.body.id}`)
        .set(...setAuthorization(jurisdictionalAdminAccessToken))
        .expect(200)
      expect(listingResponse.body.name).toBe(newListingCreateDto.name)

      const changeName = "new random name"
      listingResponse = await supertest(app.getHttpServer())
        .put(`/listings/${listingResponse.body.id}`)
        .send({
          ...listingResponse.body,
          name: changeName,
        })
        .set(...setAuthorization(jurisdictionalAdminAccessToken))
        .expect(200)

      expect(listingResponse.body.name).toBe(changeName)
    })

    it("can add/view/edit all users within their jurisdiction", async () => {
      // create jurisdiction
      const jurisdiction = await jurisdictionsRepository.save({
        name: `j-${uuid.v4()}`,
        rentalAssistanceDefault: "",
      })

      const password = "abcdef"
      const createJurisdictionalAdminDto: DeepPartial<User> = {
        email: `j-admin-${uuid.v4()}@example.com`,
        firstName: "first",
        middleName: "mid",
        lastName: "last",
        dob: new Date(),
        passwordHash: await passwordService.passwordToHash(password),
        jurisdictions: [jurisdiction],
        confirmedAt: new Date(),
        mfaEnabled: false,
        roles: { isJurisdictionalAdmin: true },
      }

      await usersRepository.save(createJurisdictionalAdminDto)

      const jurisdictionalAdminAccessToken = await getUserAccessToken(
        app,
        createJurisdictionalAdminDto.email,
        password
      )
      // use jurisdictional admin account to create new user and edit it

      const newListingCreateDto = makeTestListing(jurisdiction.id)
      const listingResponse = await supertest(app.getHttpServer())
        .post(`/listings`)
        .send(newListingCreateDto)
        .set(...setAuthorization(jurisdictionalAdminAccessToken))
        .expect(201)
      expect(listingResponse.body.jurisdiction.id).toBe(jurisdiction.id)

      const userInviteDto: UserInviteDto = {
        email: `partner-${uuid.v4()}@example.com`,
        firstName: "Name",
        lastName: "Name",
        jurisdictions: [jurisdiction],
        leasingAgentInListings: [{ id: listingResponse.body.id }],
        roles: {isPartner: true},
      }

      await supertest(app.getHttpServer())
        .post(`/user/invite`)
        .send(userInviteDto)
        .set("jurisdictionName", jurisdiction.name)
        .set(...setAuthorization(jurisdictionalAdminAccessToken))
        .expect(201)
    })

    it("cannot add new listings to other jurisdiction", async () => {
      // create jurisdiction
      const jurisdiction1 = await jurisdictionsRepository.save({
        name: `j-${uuid.v4()}`,
        rentalAssistanceDefault: "",
      })

      const jurisdiction2 = await jurisdictionsRepository.save({
        name: `j-${uuid.v4()}`,
        rentalAssistanceDefault: "",
      })

      const password = "abcdef"
      const createJurisdictionalAdminDto: DeepPartial<User> = {
        email: `j-admin-${uuid.v4()}@example.com`,
        firstName: "first",
        middleName: "mid",
        lastName: "last",
        dob: new Date(),
        passwordHash: await passwordService.passwordToHash(password),
        jurisdictions: [jurisdiction1],
        confirmedAt: new Date(),
        mfaEnabled: false,
        roles: { isJurisdictionalAdmin: true },
      }

      await usersRepository.save(createJurisdictionalAdminDto)

      const jurisdictionalAdminAccessToken = await getUserAccessToken(
        app,
        createJurisdictionalAdminDto.email,
        password
      )

      const newListingCreateDto = makeTestListing(jurisdiction2.id)
      await supertest(app.getHttpServer())
        .post(`/listings`)
        .send(newListingCreateDto)
        .set(...setAuthorization(jurisdictionalAdminAccessToken))
        .expect(403)
    })

    it("cannot add new users to other jurisdiction", async () => {
      const jurisdiction1 = await jurisdictionsRepository.save({
        name: `j-${uuid.v4()}`,
        rentalAssistanceDefault: "",
      })

      const jurisdiction2 = await jurisdictionsRepository.save({
        name: `j-${uuid.v4()}`,
        rentalAssistanceDefault: "",
      })

      const password = "abcdef"
      const createJurisdictionalAdminDto: DeepPartial<User> = {
        email: `j-admin-${uuid.v4()}@example.com`,
        firstName: "first",
        middleName: "mid",
        lastName: "last",
        dob: new Date(),
        passwordHash: await passwordService.passwordToHash(password),
        jurisdictions: [jurisdiction1],
        confirmedAt: new Date(),
        mfaEnabled: false,
        roles: { isJurisdictionalAdmin: true },
      }

      await usersRepository.save(createJurisdictionalAdminDto)

      const jurisdictionalAdminAccessToken = await getUserAccessToken(
        app,
        createJurisdictionalAdminDto.email,
        password
      )

      const newListingCreateDto = makeTestListing(jurisdiction2.id)
      const listingResponse = await supertest(app.getHttpServer())
        .post(`/listings`)
        .send(newListingCreateDto)
        .set(...setAuthorization(adminAccessToken))
        .expect(201)
      expect(listingResponse.body.jurisdiction.id).toBe(jurisdiction2.id)

      const userInviteDto: UserInviteDto = {
        email: `partner-${uuid.v4()}@example.com`,
        firstName: "Name",
        lastName: "Name",
        jurisdictions: [jurisdiction2],
        leasingAgentInListings: [{ id: listingResponse.body.id }],
        roles: {isPartner: true}
      }

      await supertest(app.getHttpServer())
        .post(`/user/invite`)
        .send(userInviteDto)
        .set("jurisdictionName", jurisdiction2.name)
        .set(...setAuthorization(jurisdictionalAdminAccessToken))
        .expect(403)
    })

    it("cannot add new super admins", async () => {
      const jurisdiction1 = await jurisdictionsRepository.save({
        name: `j-${uuid.v4()}`,
        rentalAssistanceDefault: "",
      })

      const password = "abcdef"
      const createJurisdictionalAdminDto: DeepPartial<User> = {
        email: `j-admin-${uuid.v4()}@example.com`,
        firstName: "first",
        middleName: "mid",
        lastName: "last",
        dob: new Date(),
        passwordHash: await passwordService.passwordToHash(password),
        jurisdictions: [jurisdiction1],
        confirmedAt: new Date(),
        mfaEnabled: false,
        roles: {isJurisdictionalAdmin: true}
      }

      await usersRepository.save(createJurisdictionalAdminDto)

      const jurisdictionalAdminAccessToken = await getUserAccessToken(
        app,
        createJurisdictionalAdminDto.email,
        password
      )

      const userInviteDto: UserInviteDto = {
        email: `partner-${uuid.v4()}@example.com`,
        firstName: "Name",
        lastName: "Name",
        jurisdictions: [jurisdiction1],
        roles: {isAdmin: true}
      }

      await supertest(app.getHttpServer())
        .post(`/user/invite`)
        .send(userInviteDto)
        .set("jurisdictionName", jurisdiction1.name)
        .set(...setAuthorization(jurisdictionalAdminAccessToken))
        .expect(403)
    })

    it("can add new jurisdictional admins to own jurisdiction but not other", async () => {
      const jurisdiction1 = await jurisdictionsRepository.save({
        name: `j-${uuid.v4()}`,
        rentalAssistanceDefault: "",
      })

      const jurisdiction2 = await jurisdictionsRepository.save({
        name: `j-${uuid.v4()}`,
        rentalAssistanceDefault: "",
      })

      const password = "abcdef"
      const createJurisdictionalAdminDto: DeepPartial<User> = {
        email: `j-admin-${uuid.v4()}@example.com`,
        firstName: "first",
        middleName: "mid",
        lastName: "last",
        dob: new Date(),
        passwordHash: await passwordService.passwordToHash(password),
        jurisdictions: [jurisdiction1],
        confirmedAt: new Date(),
        mfaEnabled: false,
        roles: {isJurisdictionalAdmin: true}
      }

      await usersRepository.save(createJurisdictionalAdminDto)

      const jurisdictionalAdminAccessToken = await getUserAccessToken(
        app,
        createJurisdictionalAdminDto.email,
        password
      )

      const userInviteDto: UserInviteDto = {
        email: `partner-${uuid.v4()}@example.com`,
        firstName: "Name",
        lastName: "Name",
        jurisdictions: [jurisdiction1],
        roles: {isJurisdictionalAdmin: true}
      }

      await supertest(app.getHttpServer())
        .post(`/user/invite`)
        .send(userInviteDto)
        .set("jurisdictionName", jurisdiction1.name)
        .set(...setAuthorization(jurisdictionalAdminAccessToken))
        .expect(201)

      userInviteDto.jurisdictions = [jurisdiction2]

      await supertest(app.getHttpServer())
        .post(`/user/invite`)
        .send(userInviteDto)
        .set("jurisdictionName", jurisdiction1.name)
        .set(...setAuthorization(jurisdictionalAdminAccessToken))
        .expect(403)
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
