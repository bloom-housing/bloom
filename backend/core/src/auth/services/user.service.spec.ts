import { Test, TestingModule } from "@nestjs/testing"
import { HttpException } from "@nestjs/common"
import { UserService } from "./user.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { User } from "../entities/user.entity"
import { USER_ERRORS } from "../user-errors"
import { AuthService } from "./auth.service"
import { AuthzService } from "./authz.service"
import { PasswordService } from "./password.service"
import { JurisdictionResolverService } from "../../jurisdictions/services/jurisdiction-resolver.service"
import { ConfigService } from "@nestjs/config"
import { UserCreateDto } from "../dto/user-create.dto"
import { Application } from "../../applications/entities/application.entity"
import { EmailService } from "../../email/email.service"
import { SmsMfaService } from "./sms-mfa.service"
import { UserInviteDto } from "../dto/user-invite.dto"
import { Listing } from "../../listings/entities/listing.entity"
import * as helpers from "../helpers/user-helpers"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
const defaultUserInfo = {
  id: null,
  email: null,
  passwordHash: null,
  passwordUpdatedAt: null,
  passwordValidForDays: null,
  resetToken: null,
  firstName: null,
  lastName: null,
  createdAt: null,
  updatedAt: null,
  jurisdictions: null,
  agreedToTermsOfService: null,
}

describe("UserService", () => {
  let service: UserService
  const mockUserRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
    findByEmail: jest.fn(),
    findByResetToken: jest.fn(),
  }

  const mockApplicationRepo = {
    createQueryBuilder: jest.fn(),
    save: jest.fn(),
  }

  const mockListingRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
    findByEmail: jest.fn(),
    findByResetToken: jest.fn(),
  }

  beforeEach(async () => {
    process.env.APP_SECRET = "SECRET"
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        {
          provide: getRepositoryToken(Application),
          useValue: mockApplicationRepo,
        },
        {
          provide: getRepositoryToken(Listing),
          useValue: mockListingRepository,
        },
        {
          provide: EmailService,
          useValue: { forgotPassword: jest.fn(), invite: jest.fn() },
        },
        {
          provide: AuthService,
          useValue: { generateAccessToken: jest.fn().mockReturnValue("accessToken") },
        },
        {
          provide: JurisdictionResolverService,
          useValue: {
            getJurisdiction: jest.fn(),
          },
        },
        AuthzService,
        { provide: SmsMfaService, useValue: { sendMfaCode: jest.fn() } },
        PasswordService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile()

    service = await module.resolve(UserService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("createUser", () => {
    it("should return EMAIL_IN_USE error if email is already in use", async () => {
      jest.spyOn(helpers, "findByEmail").mockResolvedValueOnce({
        ...defaultUserInfo,
        id: "123",
        email: "abc@xyz.com",
      })
      const user: UserCreateDto = {
        email: "abc@xyz.com",
        emailConfirmation: "abc@xyz.com",
        password: "qwerty",
        passwordConfirmation: "qwerty",
        firstName: "First",
        lastName: "Last",
        dob: new Date(),
      }
      await expect(service.createPublicUser(user, null)).rejects.toThrow(
        new HttpException(USER_ERRORS.EMAIL_IN_USE.message, USER_ERRORS.EMAIL_IN_USE.status)
      )
    })

    it("should return ERROR_SAVING if new user fails to save", async () => {
      const user: UserCreateDto = {
        email: "new@email.com",
        emailConfirmation: "new@email.com",
        password: "qwerty",
        passwordConfirmation: "qwerty",
        firstName: "First",
        lastName: "Last",
        dob: new Date(),
      }
      jest.spyOn(helpers, "findByEmail").mockResolvedValueOnce(null)
      mockUserRepo.save = jest.fn().mockRejectedValue(new Error(USER_ERRORS.ERROR_SAVING.message))
      await expect(service.createPublicUser(user, null)).rejects.toThrow(
        new HttpException(USER_ERRORS.ERROR_SAVING.message, USER_ERRORS.ERROR_SAVING.status)
      )

      // Reset mockUserRepo.save
      mockUserRepo.save = jest.fn()
    })

    it("should return EMAIL_IN_USE if attempting to resave existing public user", async () => {
      const user: UserCreateDto = {
        email: "new@email.com",
        emailConfirmation: "new@email.com",
        password: "qwerty",
        passwordConfirmation: "qwerty",
        firstName: "First",
        lastName: "Last",
        dob: new Date(),
      }
      jest.spyOn(helpers, "findByEmail").mockResolvedValueOnce({
        ...defaultUserInfo,
        ...user,
        confirmedAt: new Date(),
      })
      await expect(service._createUser(user)).rejects.toThrow(
        new HttpException(USER_ERRORS.EMAIL_IN_USE.message, USER_ERRORS.EMAIL_IN_USE.status)
      )

      // Reset mockUserRepo.save
      mockUserRepo.save = jest.fn()
    })

    it("should return EMAIL_IN_USE if attempting to create public user from existing partner user", async () => {
      const existingUser: User = {
        id: "mock id",
        email: "new@email.com",
        firstName: "First",
        lastName: "Last",
        dob: new Date(),
        confirmedAt: new Date(),
        passwordHash: "",
        passwordUpdatedAt: new Date(),
        passwordValidForDays: 0,
        resetToken: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        jurisdictions: [],
        agreedToTermsOfService: true,
      }
      existingUser.roles = { user: existingUser, userId: existingUser.id }

      const user: UserCreateDto = {
        email: "new@email.com",
        emailConfirmation: "new@email.com",
        password: "qwerty",
        passwordConfirmation: "qwerty",
        firstName: "First",
        lastName: "Last",
        dob: new Date(),
      }
      jest.spyOn(helpers, "findByEmail").mockResolvedValueOnce(existingUser)
      await expect(service._createUser(user)).rejects.toThrow(
        new HttpException(USER_ERRORS.EMAIL_IN_USE.message, USER_ERRORS.EMAIL_IN_USE.status)
      )

      // Reset mockUserRepo.save
      mockUserRepo.save = jest.fn()
    })

    it("should save successfully if attempting to create partner user from public user", async () => {
      const existingUser: User = {
        id: "mock id",
        email: "new@email.com",
        firstName: "First",
        lastName: "Last",
        dob: new Date(),
        confirmedAt: new Date(),
        passwordHash: "",
        passwordUpdatedAt: new Date(),
        passwordValidForDays: 0,
        resetToken: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        jurisdictions: [],
        agreedToTermsOfService: true,
      }

      const user: UserInviteDto = {
        email: "new@email.com",
        firstName: "First",
        lastName: "Last",
        dob: new Date(),
        jurisdictions: [],
        roles: {},
      }

      jest.spyOn(helpers, "findByEmail").mockResolvedValueOnce(existingUser)
      mockUserRepo.save = jest.fn().mockResolvedValue(user)
      const savedUser = await service.invite(user)
      expect(savedUser).toBe(user)

      // Reset mockUserRepo.save
      mockUserRepo.save = jest.fn()
    })

    it("should return EMAIL_IN_USE if attempting to recreate existing partner user", async () => {
      const existingUser: User = {
        id: "mock id",
        email: "new@email.com",
        firstName: "First",
        lastName: "Last",
        dob: new Date(),
        confirmedAt: new Date(),
        passwordHash: "",
        passwordUpdatedAt: new Date(),
        passwordValidForDays: 0,
        resetToken: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        jurisdictions: [],
        agreedToTermsOfService: true,
      }
      existingUser.roles = { user: existingUser, userId: existingUser.id }

      const user: UserInviteDto = {
        email: "new@email.com",
        firstName: "First",
        lastName: "Last",
        dob: new Date(),
        jurisdictions: [],
      }

      jest.spyOn(helpers, "findByEmail").mockResolvedValueOnce(existingUser)
      await expect(service._createUser(user)).rejects.toThrow(
        new HttpException(USER_ERRORS.EMAIL_IN_USE.message, USER_ERRORS.EMAIL_IN_USE.status)
      )

      // Reset mockUserRepo.save
      mockUserRepo.save = jest.fn()
    })
  })

  describe("forgotPassword", () => {
    it("should return undefined if email is not found", async () => {
      jest.spyOn(helpers, "findByEmail").mockResolvedValueOnce(null)
      await expect(service.forgotPassword({ email: "abc@xyz.com" })).resolves.toBeUndefined()
    })

    it("should set resetToken", async () => {
      const mockedUser = { id: "123", email: "abc@xyz.com" }
      jest
        .spyOn(helpers, "findByEmail")
        .mockResolvedValueOnce({ ...defaultUserInfo, ...mockedUser, resetToken: null })
      const user = await service.forgotPassword({ email: "abc@xyz.com" })
      expect(user["resetToken"]).toBeDefined()
    })
  })

  describe("updatePassword", () => {
    const updateDto = { password: "qwerty", passwordConfirmation: "qwerty", token: "abcefg" }
    it("should return 400 if email is not found", async () => {
      jest.spyOn(helpers, "findByResetToken").mockResolvedValueOnce(null)
      await expect(service.updatePassword(updateDto)).rejects.toThrow(
        new HttpException(USER_ERRORS.TOKEN_MISSING.message, USER_ERRORS.TOKEN_MISSING.status)
      )
    })

    it("should set resetToken", async () => {
      const mockedUser = { id: "123", email: "abc@xyz.com" }
      jest.spyOn(helpers, "findByEmail").mockResolvedValueOnce(mockedUser as User)
      jest.spyOn(helpers, "findByResetToken").mockResolvedValueOnce(mockedUser as User)
      // Sets resetToken
      await service.forgotPassword({ email: "abc@xyz.com" })
      const accessToken = await service.updatePassword(updateDto)
      expect(accessToken).toBeDefined()
    })
  })
})
