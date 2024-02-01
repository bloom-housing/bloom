import {
  Controller,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MapLayersQueryParams } from '../dtos/map-layers/map-layers-query-params.dto';
import { MapLayersService } from '../services/map-layers.service';
import { MapLayerDto } from '../dtos/map-layers/map-layer.dto';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { OptionalAuthGuard } from '../guards/optional.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';

@Controller('/mapLayers')
@ApiTags('mapLayers')
@UseGuards(OptionalAuthGuard, PermissionGuard)
@PermissionTypeDecorator('mapLayers')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class MapLayersController {
  constructor(private readonly mapLayerService: MapLayersService) {}

  @Get()
  @ApiOperation({ summary: 'List map layers', operationId: 'list' })
  @ApiOkResponse({ type: MapLayerDto, isArray: true })
  async list(
    @Query() queryParams: MapLayersQueryParams,
  ): Promise<MapLayerDto[]> {
    return await this.mapLayerService.list(queryParams);
  }
}
