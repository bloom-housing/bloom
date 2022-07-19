import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { applicationSetup } from "../../src/app.module"
import { AuthModule } from "../../src/auth/auth.module"
import { getUserAccessToken } from "../utils/get-user-access-token"

// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions from "../../ormconfig.test"
import supertest from "supertest"
import { setAuthorization } from "../utils/set-authorization-helper"
import { UserService } from "../../src/auth/services/user.service"
import { UserCreateDto } from "../../src/auth/dto/user-create.dto"
import { Listing } from "../../src/listings/entities/listing.entity"
import { Jurisdiction } from "../../src/jurisdictions/entities/jurisdiction.entity"
import { UserPreferencesDto } from "../../src/auth/dto/user-preferences.dto"
import { Language } from "../../src/shared/types/language-enum"
import { User } from "../../src/auth/entities/user.entity"
import { Application } from "../../src/applications/entities/application.entity"
import { EmailService } from "../../src/email/email.service"
import { UserPreferences } from "../../src/auth/entities/user-preferences.entity"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
jest.setTimeout(30000)

describe("Users", () => {
  let app: INestApplication
  let userService: UserService
  let adminAccessToken: string

  const testEmailService = {
    /* eslint-disable @typescript-eslint/no-empty-function */
    confirmation: async () => {},
    welcome: async () => {},
    invite: async () => {},
    changeEmail: async () => {},
    forgotPassword: async () => {},
    /* eslint-enable @typescript-eslint/no-empty-function */
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dbOptions),
        TypeOrmModule.forFeature([Listing, Jurisdiction, User, Application, UserPreferences]),
        AuthModule,
      ],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile()
    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()
    userService = await moduleRef.resolve<UserService>(UserService)
    adminAccessToken = await getUserAccessToken(app, "admin@example.com", "abcdef")
  })

  it("should disallow preference changes across users", async () => {
    const createAndConfirmUser = async (createDto: UserCreateDto) => {
      const userCreateResponse = await supertest(app.getHttpServer())
        .post(`/user/`)
        .set("jurisdictionName", "Detroit")
        .send(createDto)
        .expect(201)

      const userService = await app.resolve<UserService>(UserService)
      const user = await userService.findByEmail(createDto.email)

      await supertest(app.getHttpServer())
        .put(`/user/confirm/`)
        .send({ token: user.confirmationToken })
        .expect(200)

      const accessToken = await getUserAccessToken(app, createDto.email, createDto.password)
      return { accessToken, userId: userCreateResponse.body.id }
    }

    const user1CreateDto: UserCreateDto = {
      password: "Abcdef1!",
      passwordConfirmation: "Abcdef1!",
      email: "user-1@example.com",
      emailConfirmation: "user-1@example.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
      language: Language.en,
    }

    const user2CreateDto: UserCreateDto = {
      password: "Abcdef1!",
      passwordConfirmation: "Abcdef1!",
      email: "user-2@example.com",
      emailConfirmation: "user-2@example.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
      language: Language.en,
    }

    const { userId: user1Id, accessToken: user1AccessToken } = await createAndConfirmUser(
      user1CreateDto
    )
    const { accessToken: user2AccessToken } = await createAndConfirmUser(user2CreateDto)

    const user1ProfileUpdateDto: UserPreferencesDto = {
      sendEmailNotifications: false,
      sendSmsNotifications: false,
      favoriteIds: ["example listing id"],
    }

    const user2ProfileUpdateDto: UserPreferencesDto = {
      sendEmailNotifications: true,
      sendSmsNotifications: true,
      favoriteIds: ["example of second listing id"],
    }

    const userService = await app.resolve<UserService>(UserService)

    // let user 1 edit their preferences
    await supertest(app.getHttpServer())
      .put(`/userPreferences/${user1Id}`)
      .send(user1ProfileUpdateDto)
      .set(...setAuthorization(user1AccessToken))
      .expect(200)

    // verify the listing was added as a favorite to user 1
    let user = await userService.findByEmail(user1CreateDto.email)
    expect(user.preferences.sendEmailNotifications === false)
    expect(user.preferences.sendSmsNotifications === false)
    expect(user.preferences.favoriteIds).toEqual(["example listing id"])

    // Restrict user 2 editing user 1's preferences
    await supertest(app.getHttpServer())
      .put(`/userPreferences/${user1Id}`)
      .send(user2ProfileUpdateDto)
      .set(...setAuthorization(user2AccessToken))
      .expect(403)

    // verify the listing was not added as a favorite user 1
    user = await userService.findByEmail(user1CreateDto.email)
    expect(user.preferences.sendEmailNotifications === false)
    expect(user.preferences.sendSmsNotifications === false)
    expect(user.preferences.favoriteIds).toEqual(["example listing id"])
  })
})
