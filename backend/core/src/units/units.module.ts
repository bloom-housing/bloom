import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Application } from "../entity/application.entity"
import { UnitsService } from "./units.service"
import { UnitsController } from "./units.controller"
import { AuthzService } from "../auth/authz.service"
import { AuthModule } from "../auth/auth.module"

@Module({
  imports: [TypeOrmModule.forFeature([Application]), AuthModule],
  providers: [UnitsService, AuthzService],
  exports: [UnitsService],
  controllers: [UnitsController],
})
export class UnitsModule {}
