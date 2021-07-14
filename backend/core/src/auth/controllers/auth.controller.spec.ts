import { Test, TestingModule } from "@nestjs/testing"
import { AuthController } from "./auth.controller"
import { AuthService } from "../services/auth.service"
import { UserService } from "../services/user.service"
import { EmailService } from "../../shared/email/email.service"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

describe("Auth Controller", () => {
  let controller: AuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // Add mock implementations here as needed for tests.
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: UserService, useValue: {} },
        { provide: EmailService, useValue: {} },
      ],
      controllers: [AuthController],
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })
})
