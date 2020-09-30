import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UnitsService } from "./units.service"
import { UnitsController } from "./units.controller"
import { AuthzService } from "../auth/authz.service"
import { Unit } from "../entity/unit.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Unit])],
  providers: [UnitsService, AuthzService],
  exports: [UnitsService],
  controllers: [UnitsController],
})
export class UnitsModule {}
