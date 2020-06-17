import { Test, TestingModule } from "@nestjs/testing"
import { UserController } from "./user.controller"
import { PassportModule } from "@nestjs/passport"

describe("User Controller", () => {
  let controller: UserController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule],
      controllers: [UserController],
    }).compile()

    controller = module.get<UserController>(UserController)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })
})
