import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { ContentTransferService } from '../services/content-transfer.service';
import {
  ContentTransferFile,
  ContentTransferImport,
  ContentTransferPreview,
} from '../dtos/content-transfer/content-transfer-file.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { User } from '../dtos/users/user.dto';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { mapTo } from '../utilities/mapTo';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { OptionalAuthGuard } from '../guards/optional.guard';

@Controller('contentTransfer')
@ApiTags('contentTransfer')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@UseGuards(ApiKeyGuard, OptionalAuthGuard)
export class ContentTransferController {
  constructor(
    private readonly contentTransferService: ContentTransferService,
  ) {}

  @Get('jurisdictions/:jurisdictionId/export')
  @ApiOperation({
    summary: "Export a jurisdiction's translations, content and branding",
    operationId: 'exportJurisdiction',
  })
  @ApiOkResponse({ type: ContentTransferFile })
  async exportJurisdiction(
    @Param('jurisdictionId', new ParseUUIDPipe({ version: '4' }))
    jurisdictionId: string,
    @Request() req: ExpressRequest,
  ): Promise<ContentTransferFile> {
    return this.contentTransferService.exportJurisdiction(
      jurisdictionId,
      mapTo(User, req['user']),
    );
  }

  @Get('global/export')
  @ApiOperation({
    summary: 'Export the global translation strings',
    operationId: 'exportGlobal',
  })
  @ApiOkResponse({ type: ContentTransferFile })
  async exportGlobal(
    @Request() req: ExpressRequest,
  ): Promise<ContentTransferFile> {
    return this.contentTransferService.exportGlobal(mapTo(User, req['user']));
  }

  @Post('import/preview')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Show what importing a file would change, without writing',
    operationId: 'previewImport',
  })
  @ApiOkResponse({ type: ContentTransferPreview })
  async previewImport(
    @Body() dto: ContentTransferImport,
    @Request() req: ExpressRequest,
  ): Promise<ContentTransferPreview> {
    return this.contentTransferService.previewImport(
      dto,
      mapTo(User, req['user']),
    );
  }

  @Post('import')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Replace everything a file covers with its contents',
    operationId: 'applyImport',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async applyImport(
    @Body() dto: ContentTransferImport,
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return this.contentTransferService.applyImport(
      dto,
      mapTo(User, req['user']),
    );
  }
}
