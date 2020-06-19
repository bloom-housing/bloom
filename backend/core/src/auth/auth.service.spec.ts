import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { User } from "../entity/user.entity"
import { JwtModule, JwtService } from "@nestjs/jwt"

describe("AuthService", () => {
  let service: AuthService
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: "secret" })],
      providers: [AuthService],
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
      const { sub } = jwtService.decode(jwt)
      expect(sub).toBe(user.id)
    })
  })
})
