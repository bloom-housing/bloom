import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm"
import { applicationSetup } from "../../src/app.module"
import { AuthModule } from "../../src/auth/auth.module"
import { EmailService } from "../../src/shared/email/email.service"
import { getUserAccessToken } from "../utils/get-user-access-token"

// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../../ormconfig.test")
import supertest from "supertest"
import { setAuthorization } from "../utils/set-authorization-helper"
import { UserDto } from "../../src/auth/dto/user.dto"
import { UserService } from "../../src/auth/services/user.service"
import { UserCreateDto } from "../../src/auth/dto/user-create.dto"
import { UserUpdateDto } from "../../src/auth/dto/user-update.dto"
import { UserInviteDto } from "../../src/auth/dto/user-invite.dto"
import { Listing } from "../../src/listings/entities/listing.entity"
import { Repository } from "typeorm"
import { Jurisdiction } from "../../src/jurisdictions/entities/jurisdiction.entity"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
jest.setTimeout(30000)

describe("Applications", () => {
  let app: INestApplication
  let user1AccessToken: string
  let user2AccessToken: string
  let user2Profile: UserDto
  let listingRepository: Repository<Listing>
  let jurisdictionsRepository: Repository<Jurisdiction>
  let adminAccessToken: string
  let userAccessToken: string

  const testEmailService = {
    /* eslint-disable @typescript-eslint/no-empty-function */
    confirmation: async () => {},
    welcome: async () => {},
    invite: async () => {},
    /* eslint-enable @typescript-eslint/no-empty-function */
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dbOptions),
        TypeOrmModule.forFeature([Listing, Jurisdiction]),
        AuthModule,
      ],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile()
    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()

    user1AccessToken = await getUserAccessToken(app, "test@example.com", "abcdef")
    user2AccessToken = await getUserAccessToken(app, "test2@example.com", "ghijkl")

    user2Profile = (
      await supertest(app.getHttpServer())
        .get("/user")
        .set(...setAuthorization(user2AccessToken))
    ).body
    listingRepository = moduleRef.get<Repository<Listing>>(getRepositoryToken(Listing))
    jurisdictionsRepository = moduleRef.get<Repository<Jurisdiction>>(
      getRepositoryToken(Jurisdiction)
    )
    adminAccessToken = await getUserAccessToken(app, "admin@example.com", "abcdef")
    userAccessToken = await getUserAccessToken(app, "test@example.com", "abcdef")
  })

  it("should not allow user to create an account with weak password", async () => {
    const userCreateDto: UserCreateDto = {
      password: "abcdef",
      passwordConfirmation: "abcdef",
      email: "abc@b.com",
      emailConfirmation: "abc@b.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
    }
    await supertest(app.getHttpServer()).post(`/user/`).send(userCreateDto).expect(400)
  })

  it("should not allow user to create an account which is already confirmed nor confirm it using PUT", async () => {
    const userCreateDto: UserCreateDto = {
      password: "Abcdef1!",
      passwordConfirmation: "Abcdef1!",
      email: "abc@b.com",
      emailConfirmation: "abc@b.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
      confirmedAt: new Date(),
    }
    await supertest(app.getHttpServer())
      .post(`/user/`)
      .set("jurisdictionName", "Alameda")
      .send(userCreateDto)
      .expect(403)

    delete userCreateDto.confirmedAt
    const userCreateResponse = await supertest(app.getHttpServer())
      .post(`/user/`)
      .set("jurisdictionName", "Alameda")
      .send(userCreateDto)
      .expect(201)

    expect(userCreateResponse.body.confirmedAt).toBe(null)

    // Not confirmed user should not be able to log in
    await supertest(app.getHttpServer())
      .post("/auth/login")
      .send({ email: userCreateDto.email, password: userCreateDto.password })
      .expect(401)

    const userModifyResponse = await supertest(app.getHttpServer())
      .put(`/user/${userCreateResponse.body.id}`)
      .set(...setAuthorization(adminAccessToken))
      .send({
        ...userCreateResponse.body,
        confirmedAt: new Date(),
      })
      .expect(200)

    expect(userModifyResponse.body.confirmedAt).toBeDefined()

    const userLoginResponse = await supertest(app.getHttpServer())
      .post("/auth/login")
      .send({ email: userCreateDto.email, password: userCreateDto.password })
      .expect(201)

    await supertest(app.getHttpServer())
      .put(`/user/${userCreateResponse.body.id}`)
      .send({
        ...userCreateResponse.body,
        confirmedAt: new Date(),
      })
      .set(...setAuthorization(userLoginResponse.body.accessToken))
      .expect(403)
  })

  it("should allow anonymous user to create an account", async () => {
    const userCreateDto: UserCreateDto = {
      password: "Abcdef1!",
      passwordConfirmation: "Abcdef1!",
      email: "a@b.com",
      emailConfirmation: "a@b.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
    }
    const mockWelcome = jest.spyOn(testEmailService, "welcome")
    const res = await supertest(app.getHttpServer())
      .post(`/user`)
      .set("jurisdictionName", "Alameda")
      .send(userCreateDto)
    expect(mockWelcome.mock.calls.length).toBe(1)
    expect(res.body).toHaveProperty("id")
    expect(res.body).not.toHaveProperty("passwordHash")
  })

  it("should not allow user to sign in before confirming the account", async () => {
    const userCreateDto: UserCreateDto = {
      password: "Abcdef1!",
      passwordConfirmation: "Abcdef1!",
      email: "a1@b.com",
      emailConfirmation: "a1@b.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
    }
    await supertest(app.getHttpServer())
      .post(`/user/`)
      .set("jurisdictionName", "Alameda")
      .send(userCreateDto)
      .expect(201)
    await supertest(app.getHttpServer())
      .post("/auth/login")
      .send({ email: userCreateDto.email, password: userCreateDto.password })
      .expect(401)

    const userService = await app.resolve<UserService>(UserService)
    const user = await userService.findByEmail(userCreateDto.email)

    await supertest(app.getHttpServer())
      .put(`/user/confirm/`)
      .send({ token: user.confirmationToken })
      .expect(200)
    await getUserAccessToken(app, userCreateDto.email, userCreateDto.password)
  })

  it("should not allow user to create an account without matching confirmation", async () => {
    const userCreateDto: UserCreateDto = {
      password: "Abcdef1!",
      passwordConfirmation: "abcdef2",
      email: "a2@b.com",
      emailConfirmation: "a2@b.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
    }
    await supertest(app.getHttpServer()).post(`/user/`).send(userCreateDto).expect(400)
    userCreateDto.passwordConfirmation = "Abcdef1!"
    userCreateDto.emailConfirmation = "a1@b.com"
    await supertest(app.getHttpServer()).post(`/user/`).send(userCreateDto).expect(400)
    userCreateDto.emailConfirmation = "a2@b.com"
    await supertest(app.getHttpServer())
      .post(`/user/`)
      .set("jurisdictionName", "Alameda")
      .send(userCreateDto)
      .expect(201)
  })

  it("should not allow to create a new account with duplicate email", async () => {
    const userCreateDto: UserCreateDto = {
      password: "Abcdef1!",
      passwordConfirmation: "Abcdef1!",
      email: "b@c.com",
      emailConfirmation: "b@c.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
    }
    const res = await supertest(app.getHttpServer())
      .post(`/user`)
      .set("jurisdictionName", "Alameda")
      .send(userCreateDto)
      .expect(201)
    expect(res.body).toHaveProperty("id")
    await supertest(app.getHttpServer()).post(`/user/`).send(userCreateDto).expect(400)
  })

  it("should not allow user/anonymous to modify other existing user's data", async () => {
    const user2UpdateDto: UserUpdateDto = {
      id: user2Profile.id,
      dob: new Date(),
      firstName: "First",
      lastName: "Last",
      email: "test2@example.com",
      jurisdictions: user2Profile.jurisdictions.map((jurisdiction) => ({
        id: jurisdiction.id,
      })),
    }
    await supertest(app.getHttpServer())
      .put(`/user/${user2UpdateDto.id}`)
      .send(user2UpdateDto)
      .set(...setAuthorization(user1AccessToken))
      .expect(403)
    await supertest(app.getHttpServer())
      .put(`/user/${user2UpdateDto.id}`)
      .send(user2UpdateDto)
      .expect(403)
  })

  it("should allow user to resend confirmation", async () => {
    const userCreateDto: UserCreateDto = {
      password: "Abcdef1!",
      passwordConfirmation: "Abcdef1!",
      email: "b1@b.com",
      emailConfirmation: "b1@b.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
    }
    await supertest(app.getHttpServer())
      .post(`/user/`)
      .set("jurisdictionName", "Alameda")
      .send(userCreateDto)
      .expect(201)
    await supertest(app.getHttpServer())
      .post("/user/resend-confirmation")
      .send({ email: userCreateDto.email })
      .expect(201)
  })

  it("should not allow user to resend confirmation if account is confirmed", async () => {
    const userCreateDto: UserCreateDto = {
      password: "Abcdef1!",
      passwordConfirmation: "Abcdef1!",
      email: "b2@b.com",
      emailConfirmation: "b2@b.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
    }
    await supertest(app.getHttpServer())
      .post(`/user/`)
      .set("jurisdictionName", "Alameda")
      .send(userCreateDto)
      .expect(201)
    const userService = await app.resolve<UserService>(UserService)
    const user = await userService.findByEmail(userCreateDto.email)

    await supertest(app.getHttpServer())
      .put(`/user/confirm/`)
      .send({ token: user.confirmationToken })
      .expect(200)
    await supertest(app.getHttpServer())
      .post("/user/resend-confirmation")
      .send({ email: userCreateDto.email })
      .expect(406)
  })

  it("should return 404 if there is no user to resend confirmation to", async () => {
    await supertest(app.getHttpServer())
      .post("/user/resend-confirmation")
      .send({ email: "unknown@email.com" })
      .expect(404)
  })

  it("should not send confirmation email when noConfirmationEmail query param is specified", async () => {
    const userCreateDto: UserCreateDto = {
      password: "Abcdef1!",
      passwordConfirmation: "Abcdef1!",
      email: "b3@b.com",
      emailConfirmation: "b3@b.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
    }
    const mockWelcome = jest.spyOn(testEmailService, "welcome")
    await supertest(app.getHttpServer())
      .post(`/user?noWelcomeEmail=true`)
      .set("jurisdictionName", "Alameda")
      .send(userCreateDto)
      .expect(201)
    expect(mockWelcome.mock.calls.length).toBe(0)
  })

  it("should invite a user to the partners portal", async () => {
    const listing = (await listingRepository.find({ take: 1 }))[0]
    const jurisdiction = (await jurisdictionsRepository.find({ take: 1 }))[0]
    const userInviteDto: UserInviteDto = {
      email: "b4@b.com",
      firstName: "First",
      middleName: "Partner",
      lastName: "Partner",
      dob: new Date(),
      leasingAgentInListings: [{ id: listing.id }],
      roles: { isPartner: true },
      jurisdictions: [{ id: jurisdiction.id }],
    }

    const mockInvite = jest.spyOn(testEmailService, "invite")

    await supertest(app.getHttpServer())
      .post(`/user/invite`)
      .set(...setAuthorization(userAccessToken))
      .send(userInviteDto)
      .expect(403)

    const response = await supertest(app.getHttpServer())
      .post(`/user/invite`)
      .send(userInviteDto)
      .set(...setAuthorization(adminAccessToken))
      .expect(201)

    const newUser = response.body

    expect(newUser.roles.isPartner).toBe(true)
    expect(newUser.roles.isAdmin).toBe(false)
    expect(newUser.leasingAgentInListings.length).toBe(1)
    expect(newUser.leasingAgentInListings[0].id).toBe(listing.id)
    expect(mockInvite.mock.calls.length).toBe(1)

    const userService = await app.resolve<UserService>(UserService)
    const user = await userService.findByEmail(newUser.email)

    const password = "Abcdef1!"
    await supertest(app.getHttpServer())
      .put(`/user/confirm/`)
      .send({ token: user.confirmationToken, password })
      .expect(200)
    const token = await getUserAccessToken(app, newUser.email, password)
    expect(token).toBeDefined()
  })
})
