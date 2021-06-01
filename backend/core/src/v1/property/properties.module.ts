import { Module } from "@nestjs/common"
import { PropertiesController } from "./properties.controller"
import { PropertiesService } from "./properties.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Property } from "./entities/property.entity"
import { AuthModule } from "../auth/auth.module"

@Module({
  imports: [TypeOrmModule.forFeature([Property]), AuthModule],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
