import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePresignedUploadMetadataResponse } from '../dtos/assets/create-presign-upload-meta-response.dto';
import { CreatePresignedUploadMetadata } from '../dtos/assets/create-presigned-upload-meta.dto';
import { AssetService } from '../services/asset.service';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';

@Controller('assets')
@ApiTags('assets')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@ApiExtraModels(
  CreatePresignedUploadMetadata,
  CreatePresignedUploadMetadataResponse,
)
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
