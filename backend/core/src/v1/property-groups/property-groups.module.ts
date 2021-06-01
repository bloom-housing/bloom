import { Module } from "@nestjs/common"
import { PropertyGroupsController } from "./property-groups.controller"
import { PropertyGroupsService } from "./property-groups.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "../auth/auth.module"
import { PropertyGroup } from "./entities/property-group.entity"

@Module({
  imports: [TypeOrmModule.forFeature([PropertyGroup]), AuthModule],
  controllers: [PropertyGroupsController],
  providers: [PropertyGroupsService],
})
export class PropertyGroupsModule {}
