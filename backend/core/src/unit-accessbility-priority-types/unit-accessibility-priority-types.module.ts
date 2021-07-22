import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "../auth/auth.module"
import { UnitAccessibilityPriorityTypesService } from "./unit-accessibility-priority-types.service"
import { UnitAccessibilityPriorityTypesController } from "./unit-accessibility-priority-types.controller"
import { UnitAccessibilityPriorityType } from "./entities/unit-accessibility-priority-type.entity"

@Module({
  imports: [TypeOrmModule.forFeature([UnitAccessibilityPriorityType]), AuthModule],
  controllers: [UnitAccessibilityPriorityTypesController],
  providers: [UnitAccessibilityPriorityTypesService],
})
export class UnitAccessibilityPriorityTypesModule {}
