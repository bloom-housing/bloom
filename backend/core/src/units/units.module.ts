import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Application } from "../entity/application.entity"
import { UnitsService } from "./units.service"
import { UnitsController } from "./units.controller"

@Module({
  imports: [TypeOrmModule.forFeature([Application])],
  providers: [UnitsService],
  exports: [UnitsService],
  controllers: [UnitsController],
})
export class UnitsModule {}
