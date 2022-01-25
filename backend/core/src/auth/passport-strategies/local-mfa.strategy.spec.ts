import { Test, TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { User } from "../entities/user.entity"
import { ConfigModule, ConfigService } from "@nestjs/config"
import Joi from "joi"
import { PasswordService } from "../services/password.service"
import { LocalMfaStrategy } from "./local-mfa.strategy"
import { HttpException, UnauthorizedException } from "@nestjs/common"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

describe("LocalStrategy", () => {
  let configService: ConfigService
  let module: TestingModule
  let mockUser
  let mockUserRepository
  let mockPasswordService

  beforeEach(async () => {
    mockPasswordService = { isPasswordValid: jest.fn() }

    mockUserRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    }

    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          validationSchema: Joi.object({
            AUTH_LOCK_LOGIN_AFTER_FAILED_ATTEMPTS: Joi.number().default(5),
            AUTH_LOCK_LOGIN_COOLDOWN_MS: Joi.number().default(1000 * 60 * 30),
          }),
        }),
      ],
      providers: [
        { provide: PasswordService, useValue: mockPasswordService },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        LocalMfaStrategy,
      ],
    }).compile()
    configService = module.get<ConfigService>(ConfigService)
  })

  describe("user login", () => {
    it("should block 5 consecutive failed login attempts", async () => {
      mockUser = {
        lastLoginAt: new Date(),
        failedLoginAttemptsCount: 0,
        passwordUpdatedAt: new Date(),
        confirmedAt: new Date(),
        hasLoggedInAtLeastOnce: jest.fn(),
        isPartnerOrAdmin: jest.fn(),
        hasOutdatedPassword: jest.fn(),
        mfaEnabled: false,
      }
      mockUserRepository.findOne.mockResolvedValue(mockUser)
      mockUser.hasLoggedInAtLeastOnce.mockReturnValue(true)
      mockUser.isPartnerOrAdmin.mockReturnValue(true)
      mockUser.hasOutdatedPassword.mockReturnValue(false)
      mockPasswordService.isPasswordValid.mockResolvedValue(false)

      const localStrategy = module.get<LocalMfaStrategy>(LocalMfaStrategy)

      const loginRequest = {
        body: {email: "test@example.com", password: ""}
      } as any

      for (let i = configService.get<number>("AUTH_LOCK_LOGIN_AFTER_FAILED_ATTEMPTS"); i > 0; i--) {
        await expect(localStrategy.validate(loginRequest)).rejects.toThrow(UnauthorizedException)
      }
      // Next attempt should throw a different exception
      await expect(localStrategy.validate(loginRequest)).rejects.toThrow(HttpException)

      // Reset cooldown
      mockUser.lastLoginAt = new Date(0)
      await expect(localStrategy.validate(loginRequest)).rejects.toThrow(UnauthorizedException)
      // Failed login attempts count should not be reset so next login attempt should lock out an
      //  account for next cooldown period
      await expect(localStrategy.validate(loginRequest)).rejects.toThrow(HttpException)
      expect(mockUser.failedLoginAttemptsCount).toBe(7)

      // Check if login with valid credentials is still possible after cooldown
      mockUser.lastLoginAt = new Date(0)
      mockPasswordService.isPasswordValid.mockResolvedValue(true)
      await expect(localStrategy.validate(loginRequest)).resolves.toBe(mockUser)
      expect(mockUser.failedLoginAttemptsCount).toBe(0)
    })
  })
})
