import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ApplicationMethodsService } from "./application-method.service"
import { ApplicationMethodsController } from "./application-methods.controller"
import { ApplicationMethod } from "../entity/application-method.entity"

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationMethod])],
  providers: [ApplicationMethodsService],
  exports: [ApplicationMethodsService],
  controllers: [ApplicationMethodsController],
})
export class ApplicationMethodsModule {}
