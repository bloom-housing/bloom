import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MapLayers } from '@prisma/client';
import { MapLayersQueryParams } from '../dtos/map-layers/map-layers-query-params.dto';

@Injectable()
export class MapLayersService {
  constructor(private prisma: PrismaService) {}

  list(queryParams: MapLayersQueryParams): Promise<MapLayers[]> {
    if (queryParams.jurisdictionId) {
      return this.prisma.mapLayers.findMany({
        where: {
          jurisdictionId: queryParams.jurisdictionId,
        },
      });
    }
    return this.prisma.mapLayers.findMany();
  }
}
