import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { applicationSetup } from "../../src/app.module"
import { AuthModule } from "../../src/auth/auth.module"
import { EmailService } from "../../src/shared/email/email.service"
import { getUserAccessToken } from "../utils/get-user-access-token"

// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../../ormconfig.test")
import { UserModule } from "../../src/user/user.module"
import supertest from "supertest"
import { setAuthorization } from "../utils/set-authorization-helper"
import { UserCreateDto, UserDto, UserUpdateDto } from "../../src/user/dto/user.dto"
import { UserService } from "../../src/user/user.service"

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

  const testEmailService = {
    /* eslint-disable @typescript-eslint/no-empty-function */
    confirmation: async () => {},
    welcome: async () => {},
    /* eslint-enable @typescript-eslint/no-empty-function */
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dbOptions), AuthModule, UserModule],
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
    const res = await supertest(app.getHttpServer()).post(`/user`).send(userCreateDto)
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
    await supertest(app.getHttpServer()).post(`/user/`).send(userCreateDto).expect(201)
    await supertest(app.getHttpServer())
      .post("/auth/login")
      .send({ email: userCreateDto.email, password: userCreateDto.password })
      .expect(401)

    const userService = app.get<UserService>(UserService)
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
    await supertest(app.getHttpServer()).post(`/user/`).send(userCreateDto).expect(201)
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
    const res = await supertest(app.getHttpServer()).post(`/user`).send(userCreateDto).expect(201)
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
    await supertest(app.getHttpServer()).post(`/user/`).send(userCreateDto).expect(201)
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
    await supertest(app.getHttpServer()).post(`/user/`).send(userCreateDto).expect(201)
    const userService = app.get<UserService>(UserService)
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
      .send(userCreateDto)
      .expect(201)
    expect(mockWelcome.mock.calls.length).toBe(0)
  })
})
