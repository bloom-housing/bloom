import { Test, TestingModule } from "@nestjs/testing"
import { UserController } from "./user.controller"
import { PassportModule } from "@nestjs/passport"
import { AuthService } from "../auth/auth.service"
import { UserService } from "./user.service"
import { EmailService } from "../shared/email/email.service"
import { AuthzService } from "../auth/authz.service"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

describe("User Controller", () => {
  let controller: UserController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule],
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: AuthzService, useValue: {} },
        { provide: UserService, useValue: {} },
        { provide: EmailService, useValue: {} },
      ],
      controllers: [UserController],
    }).compile()

    controller = module.get<UserController>(UserController)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })
})
