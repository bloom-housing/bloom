import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Application } from "../entity/application.entity"
import { ApplicationMethodsService } from "./application-method.service"
import { ApplicationMethodsController } from "./application-methods.controller"

@Module({
  imports: [TypeOrmModule.forFeature([Application])],
  providers: [ApplicationMethodsService],
  exports: [ApplicationMethodsService],
  controllers: [ApplicationMethodsController],
})
export class ApplicationMethodsModule {}
