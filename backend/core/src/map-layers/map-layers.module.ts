import { Module } from "@nestjs/common"
import { MapLayersService } from "./map-layers.service"
import { MapLayersController } from "./map-layers.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { MapLayer } from "./entities/map-layer.entity"
import { AuthModule } from "../auth/auth.module"

@Module({
  imports: [TypeOrmModule.forFeature([MapLayer]), AuthModule],
  providers: [MapLayersService],
  controllers: [MapLayersController],
})
export class MapLayersModule {}
