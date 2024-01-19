import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { MapLayer } from "./entities/map-layer.entity"
import { MapLayersQueryParams } from "./dto/map-layers-query-params"

@Injectable()
export class MapLayersService {
  constructor(
    @InjectRepository(MapLayer)
    private readonly mapLayerRepository: Repository<MapLayer>
  ) {}

  list(queryParams: MapLayersQueryParams): Promise<MapLayer[]> {
    if (queryParams.jurisdictionId) {
      return this.mapLayerRepository.find({ where: { jurisdictionId: queryParams.jurisdictionId } })
    }
    return this.mapLayerRepository.find()
  }
}
