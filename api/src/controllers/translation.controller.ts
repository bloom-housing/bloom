import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Put,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { LanguagesEnum, SiteEnum } from '@prisma/client';
import { TranslationService } from '../services/translation.service';
import {
  PartnersTranslationsQueryParams,
  TranslationsQueryParams,
} from '../dtos/translations/translations-query-params.dto';
import { TranslationUpdate } from '../dtos/translations/translation-update.dto';
import { TranslationRawKey } from '../dtos/translations/translation-raw-key.dto';
import { TranslationOverrideRow } from '../dtos/translations/translation-override-row.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { User } from '../dtos/users/user.dto';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { PUBLIC_CACHE_CONTROL } from '../utilities/cache-control';
import { mapTo } from '../utilities/mapTo';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { OptionalAuthGuard } from '../guards/optional.guard';

const OVERRIDES_OK_RESPONSE = {
  schema: {
    type: 'object',
    additionalProperties: {
      type: 'object',
      additionalProperties: { type: 'string' },
    },
  },
} as const;

@Controller('translations')
@ApiTags('translations')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@UseGuards(ApiKeyGuard, OptionalAuthGuard)
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Get('jurisdictions/:jurisdictionId')
  @ApiOperation({
    summary: "Get a jurisdiction's site translation overrides",
    operationId: 'jurisdictionOverrides',
  })
  @ApiOkResponse(OVERRIDES_OK_RESPONSE)
  @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
  async jurisdictionOverrides(
    @Param('jurisdictionId', new ParseUUIDPipe({ version: '4' }))
    jurisdictionId: string,
    @Query() queryParams: TranslationsQueryParams,
  ): Promise<Record<string, Record<string, string>>> {
    return this.translationService.getJurisdictionOverridesById(
      jurisdictionId,
      queryParams.language ?? LanguagesEnum.en,
      queryParams.site,
    );
  }

  @Get('byName/:jurisdictionName')
  @ApiOperation({
    summary: "Get a jurisdiction's site translation overrides by name",
    operationId: 'jurisdictionOverridesByName',
  })
  @ApiOkResponse(OVERRIDES_OK_RESPONSE)
  @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
  async jurisdictionOverridesByName(
    @Param('jurisdictionName') jurisdictionName: string,
    @Query() queryParams: TranslationsQueryParams,
  ): Promise<Record<string, Record<string, string>>> {
    return this.translationService.getJurisdictionOverridesByName(
      jurisdictionName,
      queryParams.language ?? LanguagesEnum.en,
      queryParams.site,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get the global Partners translation overrides',
    operationId: 'partnersOverrides',
  })
  @ApiOkResponse(OVERRIDES_OK_RESPONSE)
  @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
  async partnersOverrides(
    @Query() queryParams: PartnersTranslationsQueryParams,
  ): Promise<Record<string, Record<string, string>>> {
    return this.translationService.getJurisdictionOverrides(
      null,
      queryParams.language ?? LanguagesEnum.en,
      SiteEnum.partners,
    );
  }

  @Get('jurisdictions/:jurisdictionId/raw')
  @ApiOperation({
    summary: "List a jurisdiction's override keys",
    operationId: 'listRawTranslations',
  })
  @ApiOkResponse({ type: TranslationOverrideRow, isArray: true })
  async listRawTranslations(
    @Param('jurisdictionId', new ParseUUIDPipe({ version: '4' }))
    jurisdictionId: string,
    @Request() req: ExpressRequest,
  ): Promise<TranslationOverrideRow[]> {
    return this.translationService.listRawOverrides(
      jurisdictionId,
      mapTo(User, req['user']),
    );
  }

  @Get('jurisdictions/:jurisdictionId/raw/:site/:language')
  @ApiOperation({
    summary:
      "Get a scope's editable override keys. stale = true, if its English source changed since it was translated",
    operationId: 'getRawTranslations',
  })
  @ApiOkResponse({ type: TranslationRawKey, isArray: true })
  async getRawTranslations(
    @Param('jurisdictionId', new ParseUUIDPipe({ version: '4' }))
    jurisdictionId: string,
    @Param('site', new ParseEnumPipe(SiteEnum)) site: SiteEnum,
    @Param('language', new ParseEnumPipe(LanguagesEnum))
    language: LanguagesEnum,
    @Request() req: ExpressRequest,
  ): Promise<TranslationRawKey[]> {
    return this.translationService.getRawOverrides(
      jurisdictionId,
      site,
      language,
      mapTo(User, req['user']),
    );
  }

  @Put('jurisdictions/:jurisdictionId/raw/:site/:language')
  @ApiOperation({
    summary: "Upsert a scope's override keys with per-key optimistic locking",
    operationId: 'updateRawTranslations',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async updateRawTranslations(
    @Param('jurisdictionId', new ParseUUIDPipe({ version: '4' }))
    jurisdictionId: string,
    @Param('site', new ParseEnumPipe(SiteEnum)) site: SiteEnum,
    @Param('language', new ParseEnumPipe(LanguagesEnum))
    language: LanguagesEnum,
    @Body() dto: TranslationUpdate,
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return this.translationService.updateOverrides(
      jurisdictionId,
      site,
      language,
      dto,
      mapTo(User, req['user']),
    );
  }

  @Delete('jurisdictions/:jurisdictionId/raw/:site/:language/:key')
  @ApiOperation({
    summary: 'Delete one override key (revert to base)',
    operationId: 'deleteRawTranslation',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async deleteRawTranslation(
    @Param('jurisdictionId', new ParseUUIDPipe({ version: '4' }))
    jurisdictionId: string,
    @Param('site', new ParseEnumPipe(SiteEnum)) site: SiteEnum,
    @Param('language', new ParseEnumPipe(LanguagesEnum))
    language: LanguagesEnum,
    @Param('key') key: string,
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return this.translationService.deleteOverride(
      jurisdictionId,
      site,
      language,
      key,
      mapTo(User, req['user']),
    );
  }

  // The global Partners overrides apply to every jurisdiction.

  @Get('partners/raw/:language')
  @ApiOperation({
    summary:
      'Get the global Partners override keys. stale = true, if its English source changed since it was translated',
    operationId: 'getRawPartnersTranslations',
  })
  @ApiOkResponse({ type: TranslationRawKey, isArray: true })
  async getRawPartnersTranslations(
    @Param('language', new ParseEnumPipe(LanguagesEnum))
    language: LanguagesEnum,
    @Request() req: ExpressRequest,
  ): Promise<TranslationRawKey[]> {
    return this.translationService.getRawOverrides(
      null,
      SiteEnum.partners,
      language,
      mapTo(User, req['user']),
    );
  }

  @Put('partners/raw/:language')
  @ApiOperation({
    summary:
      'Upsert the global Partners override keys with per-key optimistic locking',
    operationId: 'updateRawPartnersTranslations',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async updateRawPartnersTranslations(
    @Param('language', new ParseEnumPipe(LanguagesEnum))
    language: LanguagesEnum,
    @Body() dto: TranslationUpdate,
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return this.translationService.updateOverrides(
      null,
      SiteEnum.partners,
      language,
      dto,
      mapTo(User, req['user']),
    );
  }

  @Delete('partners/raw/:language/:key')
  @ApiOperation({
    summary: 'Delete one global Partners override key (revert to base)',
    operationId: 'deleteRawPartnersTranslation',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async deleteRawPartnersTranslation(
    @Param('language', new ParseEnumPipe(LanguagesEnum))
    language: LanguagesEnum,
    @Param('key') key: string,
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return this.translationService.deleteOverride(
      null,
      SiteEnum.partners,
      language,
      key,
      mapTo(User, req['user']),
    );
  }
}
