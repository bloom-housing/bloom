import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ApplicationMethodsService } from "./application-method.service"
import { ApplicationMethodsController } from "./application-methods.controller"
import { ApplicationMethod } from "./entities/application-method.entity"
import { AuthModule } from "../auth/auth.module"

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationMethod]), AuthModule],
  providers: [ApplicationMethodsService],
  exports: [ApplicationMethodsService],
  controllers: [ApplicationMethodsController],
})
export class ApplicationMethodsModule {}
