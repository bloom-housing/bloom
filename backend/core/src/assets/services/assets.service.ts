import { Injectable } from "@nestjs/common"
import { AssetCreateDto, CreateUploadUrlDto } from "../dto/asset.dto"
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

  createUploadUrl(createUploadUrlDto: CreateUploadUrlDto): Promise<string> {
    return Promise.resolve(
      this.uploadService.getPresignedUploadUrl(
        createUploadUrlDto.publicId,
        createUploadUrlDto.eager
      )
    )
  }
}
