import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { PermissionModule } from './permission.module';
import { MapLayersController } from '../controllers/map-layer.controller';
import { MapLayersService } from '../services/map-layers.service';

@Module({
  imports: [PrismaModule, PermissionModule],
  controllers: [MapLayersController],
  providers: [MapLayersService],
  exports: [MapLayersService],
})
export class MapLayerModule {}
