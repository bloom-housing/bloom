import { Controller, Get, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { MapLayersService } from "./map-layers.service"
import { ResourceType } from "../auth/decorators/resource-type.decorator"
import { OptionalAuthGuard } from "../auth/guards/optional-auth.guard"
import { AuthzGuard } from "../auth/guards/authz.guard"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { mapTo } from "../shared/mapTo"
import { MapLayerDto } from "./dto/map-layer.dto"
import { MapLayersQueryParams } from "./dto/map-layers-query-params"

@Controller("/mapLayers")
@ApiTags("mapLayers")
@ApiBearerAuth()
@ResourceType("mapLayer")
@UseGuards(OptionalAuthGuard, AuthzGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class MapLayersController {
  constructor(private readonly mapLayerService: MapLayersService) {}

  @Get()
  @ApiOperation({ summary: "List map layers", operationId: "list" })
  async list(@Query() queryParams: MapLayersQueryParams): Promise<MapLayerDto[]> {
    return mapTo(MapLayerDto, await this.mapLayerService.list(queryParams))
  }
}
