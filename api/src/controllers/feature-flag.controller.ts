import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
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
import { FeatureFlagService } from '../services/feature-flag.service';
import { FeatureFlag } from '../dtos/feature-flags/feature-flag.dto';
import { FeatureFlagAssociate } from '../dtos/feature-flags/feature-flag-associate.dto';
import { FeatureFlagCreate } from '../dtos/feature-flags/feature-flag-create.dto';
import { FeatureFlagUpdate } from '../dtos/feature-flags/feature-flag-update.dto';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { IdDTO } from '../dtos/shared/id.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
import { OptionalAuthGuard } from '../guards/optional.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { ApiKeyGuard } from '../guards/api-key.guard';

@Controller('featureFlags')
@ApiTags('featureFlags')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@ApiExtraModels(
  FeatureFlagAssociate,
  FeatureFlagCreate,
  FeatureFlagUpdate,
  IdDTO,
)
@PermissionTypeDecorator('featureFlags')
@UseGuards(ApiKeyGuard, OptionalAuthGuard, PermissionGuard)
export class FeatureFlagController {
  constructor(private readonly featureFlagService: FeatureFlagService) {}

  @Get()
  @ApiOperation({ summary: 'List of feature flags', operationId: 'list' })
  @ApiOkResponse({ type: FeatureFlag, isArray: true })
  async list(): Promise<FeatureFlag[]> {
    return await this.featureFlagService.list();
  }

  @Post()
  @ApiOperation({
    summary: 'Create a feature flag',
    operationId: 'create',
  })
  @ApiOkResponse({ type: FeatureFlag })
  async create(@Body() featureFlag: FeatureFlagCreate): Promise<FeatureFlag> {
    return await this.featureFlagService.create(featureFlag);
  }

  @Put()
  @ApiOperation({
    summary: 'Update a feature flag',
    operationId: 'update',
  })
  @ApiOkResponse({ type: FeatureFlag })
  async update(@Body() featureFlag: FeatureFlagUpdate): Promise<FeatureFlag> {
    return await this.featureFlagService.update(featureFlag);
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete a feature flag by id',
    operationId: 'delete',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async delete(@Body() dto: IdDTO): Promise<SuccessDTO> {
    return await this.featureFlagService.delete(dto.id);
  }

  @Put(`associateJurisdictions`)
  @ApiOperation({
    summary: 'Associate and disassociate jurisdictions with a feature flag',
    operationId: 'associateJurisdictions',
  })
  @ApiOkResponse({ type: FeatureFlag })
  async associateJurisdictions(
    @Body() featureFlagAssociate: FeatureFlagAssociate,
  ): Promise<FeatureFlag> {
    return await this.featureFlagService.associateJurisdictions(
      featureFlagAssociate,
    );
  }

  @Get(`:featureFlagId`)
  @ApiOperation({
    summary: 'Get a feature flag by id',
    operationId: 'retrieve',
  })
  @ApiOkResponse({ type: FeatureFlag })
  async retrieve(
    @Param('featureFlagId', new ParseUUIDPipe({ version: '4' }))
    featureFlagId: string,
  ): Promise<FeatureFlag> {
    return this.featureFlagService.findOne(featureFlagId);
  }
}
