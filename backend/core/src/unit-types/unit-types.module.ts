import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "../auth/auth.module"
import { UnitTypesService } from "./unit-types.service"
import { UnitType } from "./entities/unit-type.entity"
import { UnitTypesController } from "./unit-types.controller"

@Module({
  imports: [TypeOrmModule.forFeature([UnitType]), AuthModule],
  controllers: [UnitTypesController],
  providers: [UnitTypesService],
})
export class UnitTypesModule {}
