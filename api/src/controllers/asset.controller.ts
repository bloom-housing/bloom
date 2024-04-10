import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { CreatePresignedUploadMetadataResponse } from '../dtos/assets/create-presign-upload-meta-response.dto';
import { CreatePresignedUploadMetadata } from '../dtos/assets/create-presigned-upload-meta.dto';
import { AssetService } from '../services/asset.service';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { ApiKeyGuard } from '../guards/api-key.guard';

@Controller('assets')
@ApiTags('assets')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@ApiExtraModels(
  CreatePresignedUploadMetadata,
  CreatePresignedUploadMetadataResponse,
)
@PermissionTypeDecorator('asset')
@UseGuards(ApiKeyGuard, JwtAuthGuard, PermissionGuard)
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post('/presigned-upload-metadata')
  @ApiOperation({
    summary: 'Create presigned upload metadata',
    operationId: 'createPresignedUploadMetadata',
  })
  @ApiOkResponse({ type: CreatePresignedUploadMetadataResponse })
  async create(
    @Body() createPresignedUploadMetadata: CreatePresignedUploadMetadata,
  ): Promise<CreatePresignedUploadMetadataResponse> {
    return await this.assetService.createPresignedUploadMetadata(
      createPresignedUploadMetadata,
    );
  }
}
