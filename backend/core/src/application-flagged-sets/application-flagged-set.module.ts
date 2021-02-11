import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ApplicationFlaggedSetService } from "./application-flagged-set.service"
import { ApplicationFlaggedSet } from "./entities/application-flagged-set.entity"
import { ApplicationFlaggedSetController } from "./application-flagged-set.controller"
import { Application } from "../applications/entities/application.entity"

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationFlaggedSet, Application])],
  providers: [ApplicationFlaggedSetService],
  exports: [ApplicationFlaggedSetService],
  controllers: [ApplicationFlaggedSetController],
})
export class ApplicationFlaggedSetModule {}
