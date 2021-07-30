import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "../auth/auth.module"
import { PaperApplicationsController } from "./paper-applications.controller"
import { PaperApplicationsService } from "./paper-applications.service"
import { PaperApplication } from "./entities/paper-application.entity"

@Module({
  imports: [TypeOrmModule.forFeature([PaperApplication]), AuthModule],
  controllers: [PaperApplicationsController],
  providers: [PaperApplicationsService],
})
export class PaperApplicationsModule {}
