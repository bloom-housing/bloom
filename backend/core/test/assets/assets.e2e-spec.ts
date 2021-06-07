import { Test } from "@nestjs/testing"
import { AssetsController } from "../../src/assets/assets.controller"
import { AssetsService } from "../../src/assets/services/assets.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import dbOptions = require("../../ormconfig.test")
import { Asset } from "../../src/assets/entities/asset.entity"
import { UploadService } from "../../src/assets/services/upload.service"
import { SharedModule } from "../../src/shared/shared.module"
import { AuthzService } from "../../src/auth/authz.service"

class FakeUploadService implements UploadService {
  createPresignedUploadMetadata(): { signature: string } {
    return { signature: "fake" }
  }
}

describe("AssetsController", () => {
  let assetsController: AssetsController

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        SharedModule,
        TypeOrmModule.forRoot({ ...dbOptions, keepConnectionAlive: true }),
        TypeOrmModule.forFeature([Asset]),
      ],
      controllers: [AssetsController],
      providers: [
        AssetsService,
        { provide: UploadService, useClass: FakeUploadService },
        AuthzService,
      ],
    }).compile()
    assetsController = moduleRef.get<AssetsController>(AssetsController)
  })

  describe("create", () => {
    it("should create an asset", async () => {
      const assetInput = {
        fileId: "fileId",
        label: "label",
      }
      const asset = await assetsController.create(assetInput)
      expect(asset).toMatchObject(assetInput)
      expect(asset).toHaveProperty("id")
      expect(asset).toHaveProperty("createdAt")
      expect(asset).toHaveProperty("updatedAt")
    })

    it("should create a presigned url for upload", async () => {
      const publicId = "publicId"
      const eager = "eager"
      const createPresignedUploadMetadataResponseDto = await assetsController.createPresignedUploadMetadata(
        { parametersToSign: { publicId, eager } }
      )
      expect(createPresignedUploadMetadataResponseDto).toHaveProperty("signature")
      expect(createPresignedUploadMetadataResponseDto.signature).toBe("fake")
    })
  })
})
