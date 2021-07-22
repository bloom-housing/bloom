import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "../auth/auth.module"
import { UnitRentType } from "./entities/unit-rent-type.entity"
import { UnitRentTypesService } from "./unit-rent-types.service"
import { UnitRentTypesController } from "./unit-rent-types.controller"

@Module({
  imports: [TypeOrmModule.forFeature([UnitRentType]), AuthModule],
  controllers: [UnitRentTypesController],
  providers: [UnitRentTypesService],
})
export class UnitRentTypesModule {}
