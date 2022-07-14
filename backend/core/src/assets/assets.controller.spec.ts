import { Test, TestingModule } from "@nestjs/testing"
import { AssetsController } from "./assets.controller"
import { AssetsService } from "./services/assets.service"
import { AuthzService } from "../auth/services/authz.service"

describe("AssetsController", () => {
  let controller: AssetsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetsController],
      providers: [
        {
          provide: AuthzService,
          useValue: {},
        },
        {
          provide: AssetsService,
          useValue: {},
        },
      ],
    }).compile()

    controller = module.get<AssetsController>(AssetsController)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })
})
