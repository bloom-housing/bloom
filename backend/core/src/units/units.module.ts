import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UnitsService } from "./units.service"
import { UnitsController } from "./units.controller"
import { AuthzService } from "../auth/services/authz.service"
import { AuthModule } from "../auth/auth.module"
import { Unit } from "./entities/unit.entity"
import { UnitType } from "../unit-types/entities/unit-type.entity"
import { UnitRentType } from "../unit-rent-types/entities/unit-rent-type.entity"
import { UnitAccessibilityPriorityType } from "../unit-accessbility-priority-types/entities/unit-accessibility-priority-type.entity"
import { User } from "../auth/entities/user.entity"

@Module({
  imports: [
    TypeOrmModule.forFeature([Unit, UnitType, UnitRentType, UnitAccessibilityPriorityType, User]),
    AuthModule,
  ],
  providers: [UnitsService, AuthzService],
  exports: [UnitsService],
  controllers: [UnitsController],
})
export class UnitsModule {}
