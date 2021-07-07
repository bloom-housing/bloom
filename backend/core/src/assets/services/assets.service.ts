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

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset) private readonly repository: Repository<Asset>,
    private readonly uploadService: UploadService
  ) {}

  async create(assetCreateDto: AssetCreateDto) {
    return await this.repository.save(assetCreateDto)
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
