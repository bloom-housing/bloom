import {
  Controller,
  Get,
  Header,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LanguagesEnum, SiteEnum } from '@prisma/client';
import { TranslationService } from '../services/translation.service';
import {
  PartnersTranslationsQueryParams,
  TranslationsQueryParams,
} from '../dtos/translations/translations-query-params.dto';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { OptionalAuthGuard } from '../guards/optional.guard';

const OVERRIDES_OK_RESPONSE = {
  schema: {
    type: 'object',
    additionalProperties: { type: 'string' },
  },
} as const;

const CACHE_CONTROL = 'public, s-maxage=300, stale-while-revalidate=600';

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
  @Header('Cache-Control', CACHE_CONTROL)
  async jurisdictionOverrides(
    @Param('jurisdictionId', new ParseUUIDPipe({ version: '4' }))
    jurisdictionId: string,
    @Query() queryParams: TranslationsQueryParams,
  ): Promise<Record<string, string>> {
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
  @Header('Cache-Control', CACHE_CONTROL)
  async jurisdictionOverridesByName(
    @Param('jurisdictionName') jurisdictionName: string,
    @Query() queryParams: TranslationsQueryParams,
  ): Promise<Record<string, string>> {
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
  @Header('Cache-Control', CACHE_CONTROL)
  async partnersOverrides(
    @Query() queryParams: PartnersTranslationsQueryParams,
  ): Promise<Record<string, string>> {
    return this.translationService.getJurisdictionOverrides(
      null,
      queryParams.language ?? LanguagesEnum.en,
      SiteEnum.partners,
    );
  }
}
