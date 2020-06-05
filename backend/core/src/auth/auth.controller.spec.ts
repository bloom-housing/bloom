import { Test, TestingModule } from "@nestjs/testing"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"

describe("Auth Controller", () => {
  let controller: AuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // Add mock implementations here as needed for tests.
      providers: [{ provide: AuthService, useValue: {} }],
      controllers: [AuthController],
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })
})
