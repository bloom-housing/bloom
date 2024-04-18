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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Request } from 'express';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { mapTo } from '../utilities/mapTo';
import { Asset } from '../dtos/assets/asset.dto';
import { AssetCreate } from '../dtos/assets/asset-create.dto';
import { CreatePresignedUploadMetadata } from '../dtos/assets/create-presigned-upload-meta.dto';
import { CreatePresignedUploadMetadataResponse } from '../dtos/assets/create-presign-upload-meta-response.dto';
import { FileUploadResult } from '../services/uploads';
import {
  PaginationFactory,
  PaginationQueryParams,
} from '../dtos/shared/pagination.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { AssetService } from '../services/asset.service';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
import { ThrottleGuard } from '../guards/throttler.guard';

export class PaginatedAssetsDto extends PaginationFactory<Asset>(Asset) {}

// File upload validation vars
const maxFileSizeMb = parseFloat(process.env.ASSET_UPLOAD_MAX_SIZE) || 5;
const maxFileSize = maxFileSizeMb * 1024 * 1024;
const allowedFileTypes = [
  'application/pdf',
  'document/pdf',
  'image/jpg',
  'image/jpeg',
  'image/png',
];

@Controller('asset')
@ApiTags('asset')
@ApiBearerAuth()
@PermissionTypeDecorator('asset')
@UsePipes(
  new ValidationPipe({
    ...defaultValidationPipeOptions,
  }),
)
@UseGuards(ThrottleGuard, JwtAuthGuard, PermissionGuard)
export class AssetController {
  constructor(private readonly assetsService: AssetService) {}

  @Post()
  @ApiOperation({ summary: 'Create asset', operationId: 'create' })
  async create(@Body() assetCreateDto: AssetCreate): Promise<Asset> {
    const asset = await this.assetsService.create(assetCreateDto);
    return mapTo(Asset, asset);
  }

  @Post('/upload')
  @ApiOperation({ summary: 'Upload asset', operationId: 'upload' })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileUploadResult> {
    // Ideally we would handle validation with a decorator, but ParseFilePipe
    // is only available in Nest.js 9+

    const label = request.body.label;

    if (!file) {
      throw new BadRequestException('Required file is missing');
    }

    if (file.size > maxFileSize) {
      throw new PayloadTooLargeException(
        `Uploaded files must be less than ${maxFileSizeMb} MB`,
      );
    }

    // Allowlisting on extension instead of mimetype is also reasonable
    if (!allowedFileTypes.includes(file.mimetype)) {
      throw new UnsupportedMediaTypeException(
        `Uploaded files must be a pdf or image`,
      );
    }

    // The service used to create an asset instead of just returning a file upload result.
    // Keeping this for now in case the original behavior needs to be restored.

    //const asset = await this.assetsService.upload(label, file)
    //return mapTo(AssetDto, asset)

    return await this.assetsService.upload(label, file);
  }

  @Post('/presigned-upload-metadata')
  @ApiOperation({
    summary: 'Create presigned upload metadata',
    operationId: 'createPresignedUploadMetadata',
  })
  async createPresignedUploadMetadata(
    @Body() createPresignedUploadMetadataDto: CreatePresignedUploadMetadata,
  ): Promise<CreatePresignedUploadMetadataResponse> {
    return mapTo(
      CreatePresignedUploadMetadataResponse,
      await this.assetsService.createPresignedUploadMetadata(
        createPresignedUploadMetadataDto,
      ),
    );
  }

  @Get()
  @ApiOperation({ summary: 'List assets', operationId: 'list' })
  async list(
    @Query() queryParams: PaginationQueryParams,
  ): Promise<PaginatedAssetsDto> {
    return mapTo(
      PaginatedAssetsDto,
      await this.assetsService.list(queryParams),
    );
  }

  @Get(`:assetId`)
  @ApiOperation({ summary: 'Get asset by id', operationId: 'retrieve' })
  async retrieve(@Param('assetId') assetId: string): Promise<Asset> {
    const app = await this.assetsService.findOne(assetId);
    return mapTo(Asset, app);
  }
}
