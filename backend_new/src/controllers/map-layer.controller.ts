import {
  Controller,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MapLayersQueryParams } from '../dtos/map-layers/map-layers-query-params.dto';
import { MapLayersService } from '../services/map-layers.service';
import { MapLayerDto } from '../dtos/map-layers/map-layer.dto';
import { mapTo } from '../utilities/mapTo';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { OptionalAuthGuard } from '../guards/optional.guard';
import { PermissionGuard } from '../guards/permission.guard';

@Controller('/mapLayers')
@ApiTags('mapLayers')
@ApiBearerAuth()
@UseGuards(OptionalAuthGuard, PermissionGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class MapLayersController {
  constructor(private readonly mapLayerService: MapLayersService) {}

  @Get()
  @ApiOperation({ summary: 'List map layers', operationId: 'list' })
  async list(
    @Query() queryParams: MapLayersQueryParams,
  ): Promise<MapLayerDto[]> {
    return mapTo(MapLayerDto, await this.mapLayerService.list(queryParams));
  }
}
