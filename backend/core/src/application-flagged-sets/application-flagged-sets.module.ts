import { Module } from "@nestjs/common"
import { ApplicationFlaggedSetsController } from "./application-flagged-sets.controller"
import { ApplicationFlaggedSetsService } from "./application-flagged-sets.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "../auth/auth.module"
import { ApplicationFlaggedSet } from "./entities/application-flagged-set.entity"
import { Application } from "../applications/entities/application.entity"

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationFlaggedSet, Application]), AuthModule],
  controllers: [ApplicationFlaggedSetsController],
  providers: [ApplicationFlaggedSetsService],
  exports: [ApplicationFlaggedSetsService],
})
export class ApplicationFlaggedSetsModule {}
