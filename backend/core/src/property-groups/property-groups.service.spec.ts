import { Test, TestingModule } from "@nestjs/testing"
import { PropertyGroupsService } from "./property-groups.service"

describe("PropertyGroupsService", () => {
  let service: PropertyGroupsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyGroupsService],
    }).compile()

    service = module.get<PropertyGroupsService>(PropertyGroupsService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })
})
