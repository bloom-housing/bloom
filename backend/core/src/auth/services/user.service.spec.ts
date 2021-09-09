import { Test, TestingModule } from "@nestjs/testing"
import { HttpException } from "@nestjs/common"
import { UserService } from "./user.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { User } from "../entities/user.entity"
import { USER_ERRORS } from "../user-errors"
import { EmailService } from "../../shared/email/email.service"
import { AuthService } from "./auth.service"
import { AuthzService } from "./authz.service"
import { PasswordService } from "./password.service"
import { JurisdictionResolverService } from "../../jurisdictions/services/jurisdiction-resolver.service"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

const mockedUser = { id: "123", email: "abc@xyz.com" }
const mockUserRepo = { findOne: jest.fn().mockResolvedValue(mockedUser), save: jest.fn() }

describe("UserService", () => {
  let service: UserService

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
          provide: EmailService,
          useValue: { forgotPassword: jest.fn() },
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
        PasswordService,
      ],
    }).compile()

    service = await module.resolve(UserService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("forgotPassword", () => {
    it("should return 400 if email is not found", async () => {
      mockUserRepo.findOne = jest.fn().mockResolvedValue(null)
      await expect(service.forgotPassword({ email: "abc@xyz.com" })).rejects.toThrow(
        new HttpException(USER_ERRORS.NOT_FOUND.message, USER_ERRORS.NOT_FOUND.status)
      )
    })

    it("should set resetToken", async () => {
      mockUserRepo.findOne = jest.fn().mockResolvedValue({ ...mockedUser, resetToken: null })
      const user = await service.forgotPassword({ email: "abc@xyz.com" })
      expect(user["resetToken"]).toBeDefined()
    })
  })

  describe("updatePassword", () => {
    const updateDto = { password: "qwerty", passwordConfirmation: "qwerty", token: "abcefg" }
    it("should return 400 if email is not found", async () => {
      mockUserRepo.findOne = jest.fn().mockResolvedValue(null)
      await expect(service.updatePassword(updateDto)).rejects.toThrow(
        new HttpException(USER_ERRORS.TOKEN_MISSING.message, USER_ERRORS.TOKEN_MISSING.status)
      )
    })

    it("should set resetToken", async () => {
      mockUserRepo.findOne = jest.fn().mockResolvedValue({ ...mockedUser })
      // Sets resetToken
      await service.forgotPassword({ email: "abc@xyz.com" })
      const accessToken = await service.updatePassword(updateDto)
      expect(accessToken).toBeDefined()
    })
  })
})
