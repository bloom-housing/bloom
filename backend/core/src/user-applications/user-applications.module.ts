import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserApplicationsService } from "./user-applications.service"
import { UserApplicationsController } from "./user-applications.controller"
import { Application } from "../entity/application.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Application])],
  providers: [UserApplicationsService],
  exports: [UserApplicationsService],
  controllers: [UserApplicationsController],
})
export class UserApplicationsModule {}
