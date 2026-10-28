import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Put,
  Query,
  Request,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { LanguagesEnum } from '@prisma/client';
import { JurisdictionContentService } from '../services/jurisdiction-content.service';
import { JurisdictionContent } from '../dtos/jurisdiction-content/jurisdiction-content.dto';
import { JurisdictionContentFields } from '../dtos/jurisdiction-content/jurisdiction-content-fields.dto';
import { JurisdictionContentUpdate } from '../dtos/jurisdiction-content/jurisdiction-content-update.dto';
import { JurisdictionContentQueryParams } from '../dtos/jurisdiction-content/jurisdiction-content-query-params.dto';
import { User } from '../dtos/users/user.dto';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { PUBLIC_CACHE_CONTROL } from '../utilities/cache-control';
import { mapTo } from '../utilities/mapTo';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { OptionalAuthGuard } from '../guards/optional.guard';

@Controller('jurisdictionContent')
@ApiTags('jurisdictionContent')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@UseGuards(ApiKeyGuard, OptionalAuthGuard)
export class JurisdictionContentController {
  constructor(
    private readonly jurisdictionContentService: JurisdictionContentService,
  ) {}

  @Get('jurisdictions/:jurisdictionId')
  @ApiOperation({
    summary: "Get a jurisdiction's merged structured content",
    operationId: 'jurisdictionContent',
  })
  @ApiOkResponse({ type: JurisdictionContentFields })
  @ApiNoContentResponse()
  @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
  async jurisdictionContent(
    @Param('jurisdictionId', new ParseUUIDPipe({ version: '4' }))
    jurisdictionId: string,
    @Query() queryParams: JurisdictionContentQueryParams,
    @Res({ passthrough: true }) res: ExpressResponse,
  ): Promise<JurisdictionContentFields | void> {
    return this.noContentWhenEmpty(
      await this.jurisdictionContentService.getMergedContent(
        jurisdictionId,
        queryParams.language ?? LanguagesEnum.en,
      ),
      res,
    );
  }

  @Get('byName/:jurisdictionName')
  @ApiOperation({
    summary: "Get a jurisdiction's merged structured content by name",
    operationId: 'jurisdictionContentByName',
  })
  @ApiOkResponse({ type: JurisdictionContentFields })
  @ApiNoContentResponse()
  @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
  async jurisdictionContentByName(
    @Param('jurisdictionName') jurisdictionName: string,
    @Query() queryParams: JurisdictionContentQueryParams,
    @Res({ passthrough: true }) res: ExpressResponse,
  ): Promise<JurisdictionContentFields | void> {
    return this.noContentWhenEmpty(
      await this.jurisdictionContentService.getMergedContentByName(
        jurisdictionName,
        queryParams.language ?? LanguagesEnum.en,
      ),
      res,
    );
  }

  @Get('jurisdictions/:jurisdictionId/admin')
  @ApiOperation({
    summary: "List a jurisdiction's content rows across languages",
    operationId: 'listJurisdictionContent',
  })
  @ApiOkResponse({ type: JurisdictionContent, isArray: true })
  async listJurisdictionContent(
    @Param('jurisdictionId', new ParseUUIDPipe({ version: '4' }))
    jurisdictionId: string,
    @Request() req: ExpressRequest,
  ): Promise<JurisdictionContent[]> {
    return this.jurisdictionContentService.listContent(
      jurisdictionId,
      mapTo(User, req['user']),
    );
  }

  @Get('jurisdictions/:jurisdictionId/admin/:language')
  @ApiOperation({
    summary: "Get one language's content row for editing",
    operationId: 'getJurisdictionContent',
  })
  @ApiOkResponse({ type: JurisdictionContent })
  @ApiNoContentResponse()
  async getJurisdictionContent(
    @Param('jurisdictionId', new ParseUUIDPipe({ version: '4' }))
    jurisdictionId: string,
    @Param('language', new ParseEnumPipe(LanguagesEnum))
    language: LanguagesEnum,
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: ExpressResponse,
  ): Promise<JurisdictionContent | void> {
    return this.noContentWhenEmpty(
      await this.jurisdictionContentService.getContent(
        jurisdictionId,
        language,
        mapTo(User, req['user']),
      ),
      res,
    );
  }

  @Put('jurisdictions/:jurisdictionId/admin/:language')
  @ApiOperation({
    summary: "Upsert one language's content row with an optimistic-lock check",
    operationId: 'updateJurisdictionContent',
  })
  @ApiOkResponse({ type: JurisdictionContent })
  @HttpCode(200)
  async updateJurisdictionContent(
    @Param('jurisdictionId', new ParseUUIDPipe({ version: '4' }))
    jurisdictionId: string,
    @Param('language', new ParseEnumPipe(LanguagesEnum))
    language: LanguagesEnum,
    @Body() dto: JurisdictionContentUpdate,
    @Request() req: ExpressRequest,
  ): Promise<JurisdictionContent> {
    return this.jurisdictionContentService.updateContent(
      jurisdictionId,
      language,
      dto,
      mapTo(User, req['user']),
    );
  }

  // A null result (no row exists) is served as 204 with an empty body, so the public site falls back
  // to its in-code content and the editor starts from the English fallback.
  private noContentWhenEmpty<T>(
    result: T | null,
    res: ExpressResponse,
  ): T | void {
    if (result === null) {
      res.status(204);
      return;
    }
    return result;
  }
}
