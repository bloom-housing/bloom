import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  PayloadTooLargeException,
  Post,
  Query,
  Req,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common"
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
import { PaginationFactory, PaginationQueryParams } from "../shared/dto/pagination.dto"
import { Express, Request } from "express"
import { FileInterceptor } from "@nestjs/platform-express"

export class PaginatedAssetsDto extends PaginationFactory<AssetDto>(AssetDto) {}

// File upload validation vars
const maxFileSizeMb = parseFloat(process.env.ASSET_UPLOAD_MAX_SIZE) || 5
const maxFileSize = maxFileSizeMb * 1024 * 1024
const allowedFileTypes = ["document/pdf", "image/jpg", "image/jpeg", "image/png"]

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

  @Post("/upload")
  @ApiOperation({ summary: "Upload asset", operationId: "upload" })
  @UseInterceptors(FileInterceptor("file"))
  async upload(
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File
  ): Promise<AssetDto> {
    // Ideally we would handle validation with a decorator, but ParseFilePipe
    // is only available in Nest.js 9+

    const label = request.body.label

    if (!file) {
      throw new BadRequestException("Required file is missing")
    }

    if (file.size > maxFileSize) {
      throw new PayloadTooLargeException(`Uploaded files must be less than ${maxFileSizeMb} MB`)
    }

    if (!allowedFileTypes.includes(file.mimetype)) {
      throw new UnsupportedMediaTypeException(`Uploaded files must be a pdf or image`)
    }

    const asset = await this.assetsService.upload(label, file)
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

  @Get()
  @ApiOperation({ summary: "List assets", operationId: "list" })
  async list(@Query() queryParams: PaginationQueryParams): Promise<PaginatedAssetsDto> {
    return mapTo(PaginatedAssetsDto, await this.assetsService.list(queryParams))
  }

  @Get(`:assetId`)
  @ApiOperation({ summary: "Get asset by id", operationId: "retrieve" })
  async retrieve(@Param("assetId") assetId: string): Promise<AssetDto> {
    const app = await this.assetsService.findOne(assetId)
    return mapTo(AssetDto, app)
  }
}
