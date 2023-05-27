import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm"
import { applicationSetup } from "../../src/app.module"
import { AuthModule } from "../../src/auth/auth.module"
import { getUserAccessToken, getTokenFromCookie } from "../utils/get-user-access-token"
import qs from "qs"

// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions from "../../ormconfig.test"
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
import { UserProfileUpdateDto } from "../../src/auth/dto/user-profile.dto"
import { Language } from "../../src/shared/types/language-enum"
import { User } from "../../src/auth/entities/user.entity"
import { EnumUserFilterParamsComparison } from "../../types"
import { getTestAppBody } from "../lib/get-test-app-body"
import { Application } from "../../src/applications/entities/application.entity"
import { UserRoles } from "../../src/auth/entities/user-roles.entity"
import { EmailService } from "../../src/email/email.service"
import { MfaType } from "../../src/auth/types/mfa-type"
import dayjs from "dayjs"
import cookieParser from "cookie-parser"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
jest.setTimeout(30000)

describe("UsersService", () => {
  let app: INestApplication
  let user2AccessToken: string
  let user2Profile: UserDto
  let listingRepository: Repository<Listing>
  let applicationsRepository: Repository<Application>
  let userService: UserService
  let jurisdictionsRepository: Repository<Jurisdiction>
  let usersRepository: Repository<User>
  let adminAccessToken: string
  let userAccessToken: string

  const testEmailService = {
    /* eslint-disable @typescript-eslint/no-empty-function */
    confirmation: async () => {},
    welcome: async () => {},
    invite: async () => {},
    changeEmail: async () => {},
    forgotPassword: async () => {},
    sendMfaCode: jest.fn(),
    /* eslint-enable @typescript-eslint/no-empty-function */
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dbOptions),
        TypeOrmModule.forFeature([Listing, Jurisdiction, User, Application]),
        AuthModule,
      ],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile()
    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    app.use(cookieParser())
    await app.init()

    user2AccessToken = await getUserAccessToken(app, "test2@example.com", "ghijkl")

    user2Profile = (
      await supertest(app.getHttpServer())
        .get("/user")
        .set(...setAuthorization(user2AccessToken))
    ).body
    listingRepository = moduleRef.get<Repository<Listing>>(getRepositoryToken(Listing))
    applicationsRepository = moduleRef.get<Repository<Application>>(getRepositoryToken(Application))
    jurisdictionsRepository = moduleRef.get<Repository<Jurisdiction>>(
      getRepositoryToken(Jurisdiction)
    )
    usersRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User))
    userService = await moduleRef.resolve<UserService>(UserService)
    adminAccessToken = await getUserAccessToken(app, "admin@example.com", "abcdef")
    userAccessToken = await getUserAccessToken(app, "test@example.com", "abcdef")
  })

  it("should not allow user to create an account with weak password", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {
      // Mute the error console logging
    })
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
    jest.spyOn(console, "error").mockImplementation(() => {
      // Mute the error console logging
    })
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

    const userService = await app.resolve<UserService>(UserService)
    const user = await userService.findByIdHelper(userCreateResponse.body.id)

    expect(user.confirmedAt).toBe(null)

    // Not confirmed user should not be able to log in
    await supertest(app.getHttpServer())
      .post("/auth/login")
      .send({ email: userCreateDto.email, password: userCreateDto.password })
      .expect(401)

    const userModifyResponse = await supertest(app.getHttpServer())
      .put(`/user/${userCreateResponse.body.id}`)
      .set(...setAuthorization(adminAccessToken))
      .send({
        ...user,
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
        ...user,
        confirmedAt: new Date(),
      })
      .set(...setAuthorization(getTokenFromCookie(userLoginResponse)))
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
    expect(res.body).not.toHaveProperty("passwordUpdatedAt")
    expect(res.body).not.toHaveProperty("passwordValidForDays")
  })

  it("should not allow user to sign in before confirming the account", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {
      // Mute the error console logging
    })
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

    const userService = await app.resolve(UserService)
    const user = await userService.findByEmail(userCreateDto.email)

    await supertest(app.getHttpServer())
      .put(`/user/confirm/`)
      .send({ token: user.confirmationToken })
      .expect(200)
    await getUserAccessToken(app, userCreateDto.email, userCreateDto.password)
  })

  it("should not allow user to create an account without matching confirmation", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {
      // Mute the error console logging
    })
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
    await supertest(app.getHttpServer())
      .post(`/user/`)
      .set("jurisdictionName", "Alameda")
      .send(userCreateDto)
    expect(res.body).toHaveProperty("id")
  })

  it("should not allow user/anonymous to modify other existing user's data", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {
      // Mute the error console logging
    })
    const user2UpdateDto: UserUpdateDto = {
      id: user2Profile.id,
      dob: new Date(),
      firstName: "First",
      lastName: "Last",
      email: "test2@example.com",
      agreedToTermsOfService: false,
      jurisdictions: [],
    }
    await supertest(app.getHttpServer())
      .put(`/user/${user2UpdateDto.id}`)
      .set(...setAuthorization(userAccessToken))
      .send(user2UpdateDto)
      .expect(403)
    await supertest(app.getHttpServer())
      .put(`/user/${user2UpdateDto.id}`)
      .send(user2UpdateDto)
      .expect(401)
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
    const userService = await app.resolve(UserService)
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
      jurisdictions: [{ id: jurisdiction.id }],
      roles: { isPartner: true },
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

    const userService = await app.resolve(UserService)
    const user = await userService.findByEmail(newUser.email)
    user.mfaEnabled = false
    await usersRepository.save(user)

    const password = "Abcdef1!"
    await supertest(app.getHttpServer())
      .put(`/user/confirm/`)
      .send({ token: user.confirmationToken, password })
      .expect(200)
    const token = await getUserAccessToken(app, newUser.email, password)
    expect(token).toBeDefined()
  })

  it("should allow user to update user profile through PUT /userProfile/:id endpoint", async () => {
    const userCreateDto: UserCreateDto = {
      password: "Abcdef1!",
      passwordConfirmation: "Abcdef1!",
      email: "userProfile@b.com",
      emailConfirmation: "userProfile@b.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
      language: Language.en,
    }

    const userCreateResponse = await supertest(app.getHttpServer())
      .post(`/user/`)
      .set("jurisdictionName", "Alameda")
      .send(userCreateDto)
      .expect(201)

    const userService = await app.resolve(UserService)
    const user = await userService.findByEmail(userCreateDto.email)

    await supertest(app.getHttpServer())
      .put(`/user/confirm/`)
      .send({ token: user.confirmationToken })
      .expect(200)

    const userAccessToken = await getUserAccessToken(
      app,
      userCreateDto.email,
      userCreateDto.password
    )

    const userProfileUpdateDto: UserProfileUpdateDto = {
      id: userCreateResponse.body.id,
      createdAt: userCreateResponse.body.createdAt,
      updatedAt: userCreateResponse.body.updatedAt,
      jurisdictions: userCreateResponse.body.jurisdictions,
      ...user,
      currentPassword: userCreateDto.password,
      firstName: "NewFirstName",
      phoneNumber: "+12025550194",
      agreedToTermsOfService: false,
    }

    await supertest(app.getHttpServer())
      .put(`/userProfile/${userCreateResponse.body.id}`)
      .send(userProfileUpdateDto)
      .expect(401)

    const userProfileUpdateResponse = await supertest(app.getHttpServer())
      .put(`/userProfile/${userCreateResponse.body.id}`)
      .send(userProfileUpdateDto)
      .set(...setAuthorization(userAccessToken))
      .expect(200)
    expect(userProfileUpdateResponse.body.firstName).toBe(userProfileUpdateDto.firstName)
  })

  it("should not allow user A to edit user B profile (with /userProfile)", async () => {
    const createAndConfirmUser = async (createDto: UserCreateDto) => {
      const userCreateResponse = await supertest(app.getHttpServer())
        .post(`/user/`)
        .set("jurisdictionName", "Alameda")
        .send(createDto)
        .expect(201)

      const userService = await app.resolve(UserService)
      const user = await userService.findByEmail(createDto.email)

      await supertest(app.getHttpServer())
        .put(`/user/confirm/`)
        .send({ token: user.confirmationToken })
        .expect(200)

      const accessToken = await getUserAccessToken(app, createDto.email, createDto.password)
      return { accessToken, userId: userCreateResponse.body.id }
    }

    const userACreateDto: UserCreateDto = {
      password: "Abcdef1!",
      passwordConfirmation: "Abcdef1!",
      email: "user-a@example.com",
      emailConfirmation: "user-a@example.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
      language: Language.en,
    }

    const userBCreateDto: UserCreateDto = {
      password: "Abcdef1!",
      passwordConfirmation: "Abcdef1!",
      email: "user-b@example.com",
      emailConfirmation: "user-b@example.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
      language: Language.en,
    }

    const { userId: userAId } = await createAndConfirmUser(userACreateDto)
    const { accessToken: userBAccessToken } = await createAndConfirmUser(userBCreateDto)

    const userAProfileUpdateDto: UserProfileUpdateDto = {
      id: userAId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...userACreateDto,
      password: undefined,
      jurisdictions: [],
      agreedToTermsOfService: false,
    }

    // Restrict user B editing user A's profile
    await supertest(app.getHttpServer())
      .put(`/userProfile/${userAId}`)
      .send(userAProfileUpdateDto)
      .set(...setAuthorization(userBAccessToken))
      .expect(403)

    // Allow admin to edit userA
    await supertest(app.getHttpServer())
      .put(`/userProfile/${userAId}`)
      .send(userAProfileUpdateDto)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
  })

  it("should allow filtering by isPartner user role", async () => {
    const user = await userService._createUser({
      dob: new Date(),
      email: "michalp@airnauts.com",
      firstName: "Michal",
      jurisdictions: [],
      language: Language.en,
      lastName: "",
      middleName: "",
      roles: { isPartner: true, isAdmin: false },
      updatedAt: undefined,
      passwordHash: "abcd",
      mfaEnabled: false,
    })

    const filters = [
      {
        isPartner: true,
        $comparison: EnumUserFilterParamsComparison["="],
      },
    ]

    const res = await supertest(app.getHttpServer())
      .get(`/user/list/?${qs.stringify({ filter: filters })}`)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)

    expect(res.body.items.map((user) => user.id).includes(user.id)).toBe(true)
    expect(res.body.items.map((user) => user.roles.isPartner).some((isPartner) => !isPartner)).toBe(
      false
    )
    expect(res.body.items.map((user) => user.roles.isPartner).every((isPartner) => isPartner)).toBe(
      true
    )
  })

  it("should get and delete a user by ID", async () => {
    const user = await userService._createUser({
      dob: new Date(),
      email: "test+1@test.com",
      firstName: "test",
      jurisdictions: [],
      language: Language.en,
      lastName: "",
      middleName: "",
      roles: { isPartner: true, isAdmin: false },
      updatedAt: undefined,
      passwordHash: "abcd",
      mfaEnabled: false,
    })

    const res = await supertest(app.getHttpServer())
      .get(`/user/${user.id}`)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    expect(res.body.id).toBe(user.id)
    expect(res.body.email).toBe(user.email)

    await supertest(app.getHttpServer())
      .delete(`/user`)
      .set(...setAuthorization(adminAccessToken))
      .send({ id: user.id })
      .expect(200)

    await supertest(app.getHttpServer())
      .get(`/user/${user.id}`)
      .set(...setAuthorization(adminAccessToken))
      .expect(404)
  })

  it("should create and delete a user with existing application by ID", async () => {
    const listing = (await listingRepository.find({ take: 1 }))[0]
    const user = await userService._createUser({
      dob: new Date(),
      email: "test+1@test.com",
      firstName: "test",
      jurisdictions: [],
      language: Language.en,
      lastName: "",
      middleName: "",
      roles: { isPartner: true, isAdmin: false },
      updatedAt: undefined,
      passwordHash: "abcd",
      mfaEnabled: false,
    })
    const applicationUpdate = getTestAppBody(listing.id)
    const newApp = await applicationsRepository.save({
      ...applicationUpdate,
      user,
      confirmationCode: "abcdefgh",
    })

    await supertest(app.getHttpServer())
      .delete(`/user`)
      .set(...setAuthorization(adminAccessToken))
      .send({ id: user.id })
      .expect(200)

    const application = await applicationsRepository.findOneOrFail({
      where: { id: (newApp as Application).id },
      relations: ["user"],
    })

    expect(application.user).toBe(null)
  })

  it("should lower case email of new user", async () => {
    const userCreateDto: UserCreateDto = {
      password: "Abcdef1!",
      passwordConfirmation: "Abcdef1!",
      email: "TestingLowerCasing@LowerCasing.com",
      emailConfirmation: "TestingLowerCasing@LowerCasing.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
    }
    const res = await supertest(app.getHttpServer())
      .post(`/user`)
      .set("jurisdictionName", "Alameda")
      .send(userCreateDto)
    expect(res.body).toHaveProperty("id")
    expect(res.body).not.toHaveProperty("passwordHash")
    expect(res.body).toHaveProperty("email")
    expect(res.body.email).toBe("testinglowercasing@lowercasing.com")

    const userService = await app.resolve<UserService>(UserService)
    const user = await userService.findByIdHelper(res.body.id)

    const confirmation = await supertest(app.getHttpServer())
      .put(`/user/${res.body.id}`)
      .set(...setAuthorization(adminAccessToken))
      .send({
        ...user,
        confirmedAt: new Date(),
      })
      .expect(200)

    expect(confirmation.body.confirmedAt).toBeDefined()

    await supertest(app.getHttpServer())
      .post("/auth/login")
      .send({ email: userCreateDto.email.toLowerCase(), password: userCreateDto.password })
      .expect(201)
  })

  it("should change an email with confirmation flow", async () => {
    const userCreateDto: UserCreateDto = {
      password: "Abcdef1!",
      passwordConfirmation: "Abcdef1!",
      email: "confirm@confirm.com",
      emailConfirmation: "confirm@confirm.com",
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

    const userService = await app.resolve(UserService)
    let user = await userService.findByEmail(userCreateDto.email)

    await supertest(app.getHttpServer())
      .put(`/user/confirm/`)
      .send({ token: user.confirmationToken })
      .expect(200)
    const userAccessToken = await getUserAccessToken(
      app,
      userCreateDto.email,
      userCreateDto.password
    )

    const newEmail = "test+confirm@example.com"
    await supertest(app.getHttpServer())
      .put(`/userProfile/${user.id}`)
      .send({ ...user, newEmail, appUrl: "http://localhost" })
      .set(...setAuthorization(userAccessToken))
      .expect(200)

    // User should still be able to log in with the old email
    await getUserAccessToken(app, userCreateDto.email, userCreateDto.password)

    user = await userService.findByEmail(userCreateDto.email)
    await supertest(app.getHttpServer())
      .put(`/user/confirm/`)
      .send({ token: user.confirmationToken })
      .expect(200)

    await getUserAccessToken(app, newEmail, userCreateDto.password)
  })

  it("should allow filtering by isPortalUser", async () => {
    const usersRepository = app.get<Repository<User>>(getRepositoryToken(User))

    const totalUsersCount = await usersRepository.count()

    const allUsersListRes = await supertest(app.getHttpServer())
      .get(`/user/list`)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    expect(allUsersListRes.body.meta.totalItems).toBe(totalUsersCount)

    const portalUsersFilter = [
      {
        isPortalUser: true,
        $comparison: EnumUserFilterParamsComparison["NA"],
      },
    ]
    const portalUsersListRes = await supertest(app.getHttpServer())
      .get(`/user/list?${qs.stringify({ filter: portalUsersFilter })}&limit=200`)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    expect(
      portalUsersListRes.body.items.every(
        (user: UserDto) => user.roles.isAdmin || user.roles.isPartner
      )
    )
    expect(portalUsersListRes.body.meta.totalItems).toBeLessThan(totalUsersCount)

    const nonPortalUsersFilter = [
      {
        isPortalUser: false,
        $comparison: EnumUserFilterParamsComparison["NA"],
      },
    ]
    const nonPortalUsersListRes = await supertest(app.getHttpServer())
      .get(`/user/list?${qs.stringify({ filter: nonPortalUsersFilter })}&limit=200`)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    expect(
      nonPortalUsersListRes.body.items.every(
        (user: UserDto) => !!user.roles?.isAdmin && !!user.roles?.isPartner
      )
    )
    expect(nonPortalUsersListRes.body.meta.totalItems).toBeLessThan(totalUsersCount)
  })

  it("should require mfa code for users with mfa enabled", async () => {
    const userCreateDto: UserCreateDto = {
      password: "Abcdef1!",
      passwordConfirmation: "Abcdef1!",
      email: "mfa@b.com",
      emailConfirmation: "mfa@b.com",
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
    let user = await usersRepository.findOne({ where: { email: userCreateDto.email } })
    user.mfaEnabled = true
    user = await usersRepository.save(user)

    await supertest(app.getHttpServer())
      .put(`/user/confirm/`)
      .send({ token: user.confirmationToken })
      .expect(200)

    testEmailService.sendMfaCode = jest.fn()

    let getMfaInfoResponse = await supertest(app.getHttpServer())
      .post(`/auth/mfa-info`)
      .send({
        email: userCreateDto.email,
        password: userCreateDto.password,
      })
      .expect(201)

    expect(getMfaInfoResponse.body.maskedPhoneNumber).toBeUndefined()
    expect(getMfaInfoResponse.body.email).toBe(userCreateDto.email)
    expect(getMfaInfoResponse.body.isMfaEnabled).toBe(true)
    expect(getMfaInfoResponse.body.mfaUsedInThePast).toBe(false)

    await supertest(app.getHttpServer())
      .post(`/auth/request-mfa-code`)
      .send({
        email: userCreateDto.email,
        password: userCreateDto.password,
        mfaType: MfaType.email,
      })
      .expect(201)

    user = await usersRepository.findOne({ where: { email: userCreateDto.email } })
    expect(typeof user.mfaCode).toBe("string")
    expect(user.mfaCodeUpdatedAt).toBeDefined()
    expect(testEmailService.sendMfaCode).toBeCalled()
    expect(testEmailService.sendMfaCode.mock.calls[0][2]).toBe(user.mfaCode)

    await supertest(app.getHttpServer())
      .post(`/auth/login`)
      .send({
        email: userCreateDto.email,
        password: userCreateDto.password,
        mfaCode: user.mfaCode,
      })
      .expect(201)

    getMfaInfoResponse = await supertest(app.getHttpServer())
      .post(`/auth/mfa-info`)
      .send({
        email: userCreateDto.email,
        password: userCreateDto.password,
      })
      .expect(201)
    expect(getMfaInfoResponse.body.mfaUsedInThePast).toBe(true)
  })

  it("should prevent user access if password is outdated", async () => {
    const userCreateDto: UserCreateDto = {
      password: "Abcdef1!",
      passwordConfirmation: "Abcdef1!",
      email: "password-outdated@b.com",
      emailConfirmation: "password-outdated@b.com",
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

    const userService = await app.resolve(UserService)
    let user = await userService.findByEmail(userCreateDto.email)

    await supertest(app.getHttpServer())
      .put(`/user/confirm/`)
      .send({ token: user.confirmationToken })
      .expect(200)

    const userAccessToken = await getUserAccessToken(
      app,
      userCreateDto.email,
      userCreateDto.password
    )

    // User should be able to fetch it's own profile now
    await supertest(app.getHttpServer())
      .get(`/user/${user.id}`)
      .set(...setAuthorization(userAccessToken))
      .expect(200)

    // Put password updated at date 190 days in the past
    user = await userService.findByEmail(userCreateDto.email)
    user.roles = { isAdmin: true, isPartner: false } as UserRoles
    user.passwordUpdatedAt = new Date(user.passwordUpdatedAt.getTime() - 190 * 24 * 60 * 60 * 1000)

    await usersRepository.save(user)

    // Confirm that both login and using existing access tokens stopped authenticating
    await supertest(app.getHttpServer())
      .get(`/user/${user.id}`)
      .set(...setAuthorization(userAccessToken))
      .expect(401)

    await supertest(app.getHttpServer())
      .post("/auth/login")
      .send({ email: userCreateDto.email, password: userCreateDto.password })
      .expect(401)

    // Start password reset flow
    await supertest(app.getHttpServer())
      .put(`/user/forgot-password`)
      .send({ email: user.email })
      .expect(200)

    user = await usersRepository.findOne({ where: { email: user.email } })

    const newPassword = "Abcefghjijk90!"
    await supertest(app.getHttpServer())
      .put(`/user/update-password`)
      .send({ token: user.resetToken, password: newPassword, passwordConfirmation: newPassword })
      .expect(200)

    // Confirm that login works again (passwordUpdateAt timestamp has been refreshed)
    await supertest(app.getHttpServer())
      .post("/auth/login")
      .send({ email: userCreateDto.email, password: newPassword })
      .expect(201)
  })

  it("should fail login if too many attempts and pass after lockout period", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {
      // Mute the error console logging
    })
    const userCreateDto: UserCreateDto = {
      password: "Abcdef1!",
      passwordConfirmation: "Abcdef1!",
      email: "password@b.com",
      emailConfirmation: "password@b.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
    }

    const userCreateResponse = await supertest(app.getHttpServer())
      .post(`/user/`)
      .set("jurisdictionName", "Alameda")
      .send(userCreateDto)
      .expect(201)

    const userService = await app.resolve<UserService>(UserService)
    let user = await userService.findByEmail(userCreateDto.email)

    await supertest(app.getHttpServer())
      .put(`/user/${userCreateResponse.body.id}`)
      .set(...setAuthorization(adminAccessToken))
      .send({
        ...user,
        confirmedAt: new Date(),
      })
      .expect(200)

    // first five should fail with not authorized
    let failedResponse = await supertest(app.getHttpServer())
      .post("/auth/login")
      .send({ email: userCreateDto.email, password: "wrong password" })
      .expect(401)
    expect(failedResponse.body.failureCountRemaining).toBe(5)
    failedResponse = await supertest(app.getHttpServer())
      .post("/auth/login")
      .send({ email: userCreateDto.email, password: "wrong password2" })
      .expect(401)
    expect(failedResponse.body.failureCountRemaining).toBe(4)
    failedResponse = await supertest(app.getHttpServer())
      .post("/auth/login")
      .send({ email: userCreateDto.email, password: "wrong password3" })
      .expect(401)
    expect(failedResponse.body.failureCountRemaining).toBe(3)
    failedResponse = await supertest(app.getHttpServer())
      .post("/auth/login")
      .send({ email: userCreateDto.email, password: "wrong password4" })
      .expect(401)
    expect(failedResponse.body.failureCountRemaining).toBe(2)
    failedResponse = await supertest(app.getHttpServer())
      .post("/auth/login")
      .send({ email: userCreateDto.email, password: "wrong password5" })
      .expect(401)
    expect(failedResponse.body.failureCountRemaining).toBe(1)
    // 6th fails with too many requests
    await supertest(app.getHttpServer())
      .post("/auth/login")
      .send({ email: userCreateDto.email, password: userCreateDto.password })
      .expect(429)

    user = await userService.findByEmail(userCreateDto.email)
    user.lastLoginAt = dayjs(new Date()).subtract(31, "minutes").toDate()
    await usersRepository.save(user)

    await supertest(app.getHttpServer())
      .post("/auth/login")
      .send({ email: userCreateDto.email, password: userCreateDto.password })
      .expect(201)
  })

  it("should not crash with empty search query param", async () => {
    const usersRepository = app.get<Repository<User>>(getRepositoryToken(User))

    const totalUsersCount = await usersRepository.count()

    const allUsersListRes = await supertest(app.getHttpServer())
      .get(`/user/list?search=`)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    expect(allUsersListRes.body.meta.totalItems).toBe(totalUsersCount)
  })

  it("should find user by email and assigned listing", async () => {
    const searchableEmailAddress = "searchable-email@example.com"
    const listing = (await listingRepository.find({ take: 1 }))[0]
    const userCreateDto: UserCreateDto = {
      password: "Abcdef1!",
      passwordConfirmation: "Abcdef1!",
      email: searchableEmailAddress,
      emailConfirmation: searchableEmailAddress,
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

    let res = await supertest(app.getHttpServer())
      .get(`/user/list?search=${searchableEmailAddress}`)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    expect(res.body.items[0].email).toBe(searchableEmailAddress)

    const userRepository = await app.resolve<Repository<User>>(getRepositoryToken(User))
    const userService = await app.resolve(UserService)
    const user = await userService.findByEmail(searchableEmailAddress)

    user.leasingAgentInListings = [{ id: listing.id } as Listing]
    await userRepository.save(user)

    res = await supertest(app.getHttpServer())
      .get(`/user/list?search=${listing.name}`)
      .set(...setAuthorization(adminAccessToken))
      .expect(200)
    expect(res.body.items.map((item) => item.email).includes(searchableEmailAddress)).toBe(true)
  })
})
