import { Test } from "@nestjs/testing"
import { AssetsController } from "../../src/assets/assets.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import dbOptions = require("../../ormconfig.test")
import { Asset } from "../../src/assets/entities/asset.entity"
import { UploadService } from "../../src/assets/services/upload.service"
import { SharedModule } from "../../src/shared/shared.module"
import supertest from "supertest"
import { setAuthorization } from "../utils/set-authorization-helper"
import { applicationSetup } from "../../src/app.module"
import { INestApplication } from "@nestjs/common"
import { getUserAccessToken } from "../utils/get-user-access-token"
import { AssetsModule } from "../../src/assets/assets.module"

class FakeUploadService implements UploadService {
  createPresignedUploadMetadata(): { signature: string } {
    return { signature: "fake" }
  }
}

describe("AssetsController", () => {
  let app: INestApplication
  let assetsController: AssetsController
  let adminAccessToken: string

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        SharedModule,
        TypeOrmModule.forRoot({ ...dbOptions, keepConnectionAlive: true }),
        TypeOrmModule.forFeature([Asset]),
        AssetsModule,
      ],
    })
      .overrideProvider(UploadService)
      .useClass(FakeUploadService)
      .compile()

    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    await app.init()
    assetsController = moduleRef.get<AssetsController>(AssetsController)
    adminAccessToken = await getUserAccessToken(app, "admin@example.com", "abcdef")
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

  describe("retrieve", () => {
    it("should return a paginated assets list", async () => {
      const res = await supertest(app.getHttpServer())
        .get(`/assets/`)
        .set(...setAuthorization(adminAccessToken))
        .expect(200)
      const assets = res.body
      expect(assets).toHaveProperty("meta")
      expect(assets).toHaveProperty("items")
      expect(assets.items.length).toBeGreaterThan(0)
      expect(assets.items[0]).toHaveProperty("fileId")
      expect(assets.items[0]).toHaveProperty("label")
    })

    it("should return an asset by Id", async () => {
      const res = await supertest(app.getHttpServer())
        .get(`/assets/`)
        .set(...setAuthorization(adminAccessToken))
        .expect(200)
      expect(res.body).toHaveProperty("meta")
      expect(res.body).toHaveProperty("items")
      expect(res.body.items.length).toBeGreaterThan(0)
      const assetId = res.body.items[0].id
      const getByIdRes = await supertest(app.getHttpServer())
        .get(`/assets/${assetId}`)
        .set(...setAuthorization(adminAccessToken))
        .expect(200)
      const asset: Asset = getByIdRes.body
      expect(asset).toBeDefined()
      expect(asset).toHaveProperty("fileId")
      expect(asset).toHaveProperty("label")
    })
  })
})
