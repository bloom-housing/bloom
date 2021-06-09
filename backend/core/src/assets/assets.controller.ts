import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { mapTo } from "../shared/mapTo"
import { ResourceType } from "../auth/decorators/resource-type.decorator"
import { AuthzGuard } from "../auth/guards/authz.guard"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { DefaultAuthGuard } from "../auth/guards/default.guard"
import { AssetsService } from "./services/assets.service"
import {
  AssetCreateDto,
  AssetDto,
  CreatePresignedUploadMetadataDto,
  CreatePresignedUploadMetadataResponseDto,
} from "./dto/asset.dto"

@Controller("assets")
@ApiTags("assets")
@ApiBearerAuth()
@ResourceType("asset")
@UseGuards(DefaultAuthGuard, AuthzGuard)
@UsePipes(
  new ValidationPipe({
    ...defaultValidationPipeOptions,
  })
)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @ApiOperation({ summary: "Create asset", operationId: "create" })
  async create(@Body() assetCreateDto: AssetCreateDto): Promise<AssetDto> {
    const asset = await this.assetsService.create(assetCreateDto)
    return mapTo(AssetDto, asset)
  }

  @Post("/presigned-upload-metadata")
  @ApiOperation({
    summary: "Create presigned upload metadata",
    operationId: "createPresignedUploadMetadata",
  })
  async createPresignedUploadMetadata(
    @Body() createPresignedUploadMetadataDto: CreatePresignedUploadMetadataDto
  ): Promise<CreatePresignedUploadMetadataResponseDto> {
    return mapTo(
      CreatePresignedUploadMetadataResponseDto,
      await this.assetsService.createPresignedUploadMetadata(createPresignedUploadMetadataDto)
    )
  }
}
