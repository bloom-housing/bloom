import { Test, TestingModule } from "@nestjs/testing"
import { PropertiesService } from "./properties.service"

describe("PropertiesService", () => {
  let service: PropertiesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertiesService],
    }).compile()

    service = module.get<PropertiesService>(PropertiesService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })
})
