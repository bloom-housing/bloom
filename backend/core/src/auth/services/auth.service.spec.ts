import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { JwtModule, JwtService } from "@nestjs/jwt"
import { getRepositoryToken } from "@nestjs/typeorm"
import { RevokedToken } from "../entities/revoked-token.entity"
import { User } from "../entities/user.entity"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

describe("AuthService", () => {
  let service: AuthService
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: "secret" })],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(RevokedToken),
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    jwtService = module.get<JwtService>(JwtService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("generateAccessToken", () => {
    const user = new User()
    it("should generate a JWT", () => {
      const jwt = service.generateAccessToken(user)
      expect(jwt).toBeDefined()
      const decoded = jwtService.decode(jwt)
      expect(decoded).toBeDefined()
    })

    it("should assign the userId to the token sub", () => {
      const jwt = service.generateAccessToken(user)
      const { sub } = jwtService.decode(jwt) as { sub?: string }
      expect(sub).toBe(user.id)
    })
  })
})
