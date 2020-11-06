import { Test, TestingModule } from "@nestjs/testing"
import { PropertyGroupsController } from "./property-groups.controller"

describe("PropertyGroupsController", () => {
  let controller: PropertyGroupsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyGroupsController],
    }).compile()

    controller = module.get<PropertyGroupsController>(PropertyGroupsController)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })
})
