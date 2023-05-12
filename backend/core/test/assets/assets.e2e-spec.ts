import { Test } from "@nestjs/testing"
import { AssetsController } from "../../src/assets/assets.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import dbOptions from "../../ormconfig.test"
import { Asset } from "../../src/assets/entities/asset.entity"
import { UploadService } from "../../src/assets/services/upload.service"
import { SharedModule } from "../../src/shared/shared.module"
import supertest from "supertest"
import { setAuthorization } from "../utils/set-authorization-helper"
import { applicationSetup } from "../../src/app.module"
import { INestApplication } from "@nestjs/common"
import { getUserAccessToken } from "../utils/get-user-access-token"
import { AssetsModule } from "../../src/assets/assets.module"
import cookieParser from "cookie-parser"
import { FileServiceProvider } from "../../src/shared/uploads"

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
      .overrideProvider(FileServiceProvider)
      .useFactory({
        factory: () => {
          return new FileServiceProvider("mock")
            .registerFileService("mock", {
              isConfigured: false,
              config: {},
              /* eslint-disable @typescript-eslint/no-unused-vars */
              configure(config) {
                return null
              },
              /* eslint-disable @typescript-eslint/no-unused-vars */
              putFile(prefix, key, file) {
                return Promise.resolve({
                  id: "id",
                  url: "url",
                })
              },
              /* eslint-disable @typescript-eslint/no-unused-vars */
              generateDownloadUrl(id) {
                return Promise.resolve("url")
              },
            })
            .configure({})
        },
      })
      .compile()

    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    app.use(cookieParser())
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

  describe("upload", () => {
    it("should return an asset for a valid file", async () => {
      const label = "valid-upload"
      const data = Buffer.from("file-contents")
      const info = {
        filename: "name.pdf",
        contentType: "document/pdf",
      }

      const response = await supertest(app.getHttpServer())
        .post(`/assets/upload`)
        .field("label", label)
        .attach("file", data, info)
        .set(...setAuthorization(adminAccessToken))
        .expect(201)

      expect(response.body.label).toBe(label)
    })

    it("should reject if file is missing", async () => {
      const label = "missing"

      const response = await supertest(app.getHttpServer())
        .post(`/assets/upload`)
        .field("label", label)
        .set(...setAuthorization(adminAccessToken))
        .expect(400)

      expect(response.body.message).toMatch(/is missing/)
    })

    it("should reject files that are too large", async () => {
      const label = "too-big"
      // create a really large file in memory
      // this one will be ~20 MB
      const data = Buffer.from("text".repeat(5 * 1024 * 1024))
      const info = {
        filename: "name.pdf",
        contentType: "document/pdf",
      }

      const response = await supertest(app.getHttpServer())
        .post(`/assets/upload`)
        .field("label", label)
        .attach("file", data, info)
        .set(...setAuthorization(adminAccessToken))
        .expect(413)

      expect(response.body.message).toMatch(/Uploaded files must be/)
    })

    it("should reject files of the wrong type", async () => {
      const label = "wrong-type"
      const data = Buffer.from("a")
      const info = {
        filename: "name.txt",
        contentType: "text/plain",
      }

      const response = await supertest(app.getHttpServer())
        .post(`/assets/upload`)
        .field("label", label)
        .attach("file", data, info)
        .set(...setAuthorization(adminAccessToken))
        .expect(415)

      expect(response.body.message).toMatch(/Uploaded files must be/)
    })
  })
})
