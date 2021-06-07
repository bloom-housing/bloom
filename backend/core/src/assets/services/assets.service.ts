import { Injectable } from "@nestjs/common"
import {
  AssetCreateDto,
  CreatePresignedUploadMetadataDto,
  CreatePresignedUploadMetadataResponseDto,
} from "../dto/asset.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Asset } from "../entities/asset.entity"
import { UploadService } from "./upload.service"

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
}
