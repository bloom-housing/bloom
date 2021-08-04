import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "../auth/auth.module"
import { ApplicationMethod } from "./entities/application-method.entity"
import { ApplicationMethodsController } from "./application-methods.controller"
import { ApplicationMethodsService } from "./application-methods.service"

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationMethod]), AuthModule],
  controllers: [ApplicationMethodsController],
  providers: [ApplicationMethodsService],
})
export class ApplicationMethodsModule {}
