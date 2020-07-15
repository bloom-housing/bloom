import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Application } from "../entity/application.entity"
import { ApplicationsService } from "./applications.service"
import { ApplicationsController } from "./applications.controller"

@Module({
  imports: [TypeOrmModule.forFeature([Application])],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
  controllers: [ApplicationsController],
})
export class ApplicationsModule {}
