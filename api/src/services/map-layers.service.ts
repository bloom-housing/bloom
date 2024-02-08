import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MapLayersQueryParams } from '../dtos/map-layers/map-layers-query-params.dto';
import { MapLayerDto } from '../dtos/map-layers/map-layer.dto';

@Injectable()
export class MapLayersService {
  constructor(private prisma: PrismaService) {}

  async list(queryParams: MapLayersQueryParams): Promise<MapLayerDto[]> {
    if (queryParams.jurisdictionId) {
      return await this.prisma.mapLayers.findMany({
        where: {
          jurisdictionId: queryParams.jurisdictionId,
        },
      });
    }
    return await this.prisma.mapLayers.findMany();
  }
}
