import { Injectable, NotFoundException } from "@nestjs/common"
import {
  AssetCreateDto,
  CreatePresignedUploadMetadataDto,
  CreatePresignedUploadMetadataResponseDto,
} from "../dto/asset.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Asset } from "../entities/asset.entity"
import { UploadService } from "./upload.service"
import { paginate } from "nestjs-typeorm-paginate"
import { PaginationQueryParams } from "../../shared/dto/pagination.dto"
import { FileServiceProvider, FileUpload } from "../../shared/uploads"
import * as fs from "fs"
import { Readable } from "stream"

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset) private readonly repository: Repository<Asset>,
    private readonly uploadService: UploadService,
    private readonly fileServiceProvider: FileServiceProvider
  ) {}

  async create(assetCreateDto: AssetCreateDto) {
    return await this.repository.save(assetCreateDto)
  }

  async upload(label: string, file: Express.Multer.File) {
    const fileService = this.fileServiceProvider.activeFileService

    // convert the express File type to a package-specific interface
    const fileUpload: FileUpload = {
      name: file.originalname,
      contentType: file.mimetype,
      size: file.size,
      // create stream from the buffer if available in memory, otherwise use the path to the file
      contents: file.buffer ? Readable.from(file.buffer) : fs.createReadStream(file.path),
    }

    const result = await fileService.putFile("assets", label, fileUpload)
    return result

    /*
      This method originally created an asset and returned an AssetCreateDto, 
      but the frontend isn't yet set up to handle that scenario. The benefit
      of that approach over just the upload is having a queryable inventory of
      all files.
    */

    /*
    const asset = {
      fileId: result.url,
      label: label,
    }

    return await this.repository.save(asset)
    */
  }

  createPresignedUploadMetadata(
    createUploadUrlDto: CreatePresignedUploadMetadataDto
  ): Promise<CreatePresignedUploadMetadataResponseDto> {
    return Promise.resolve(
      this.uploadService.createPresignedUploadMetadata(createUploadUrlDto.parametersToSign)
    )
  }

  async list(queryParams: PaginationQueryParams) {
    const qb = this._getQb()
    return await paginate(qb, { limit: queryParams.limit, page: queryParams.page })
  }

  async findOne(id: string): Promise<Asset> {
    const asset = await this.repository.findOne({ where: { id } })
    if (!asset) {
      throw new NotFoundException()
    }
    return asset
  }

  private _getQb() {
    const qb = this.repository.createQueryBuilder("assets")
    return qb
  }
}
