import { Test, TestingModule } from "@nestjs/testing"
import { AssetsService } from "./assets.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Asset } from "../entities/asset.entity"
import { UploadService } from "./upload.service"

describe("AssetsService", () => {
  let service: AssetsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetsService,
        { provide: getRepositoryToken(Asset), useValue: {} },
        { provide: UploadService, useValue: {} },
      ],
    }).compile()

    service = module.get<AssetsService>(AssetsService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })
})
