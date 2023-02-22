import { forwardRef, Logger, Module } from "@nestjs/common"
import { ApplicationFlaggedSetsController } from "./application-flagged-sets.controller"
import { ApplicationFlaggedSetsService } from "./application-flagged-sets.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "../auth/auth.module"
import { ApplicationFlaggedSet } from "./entities/application-flagged-set.entity"
import { Application } from "../applications/entities/application.entity"
import { ApplicationFlaggedSetsCronjobService } from "./application-flagged-sets-cronjob.service"
import { SharedModule } from "../shared/shared.module"
import { CronJobService } from "../shared/services/cron-job.service"
import { CronJob } from "../shared/entities/cron-job.entity"
import { SchedulerRegistry } from "@nestjs/schedule"
import { Listing } from "../listings/entities/listing.entity"
import { ListingsModule } from "../listings/listings.module"

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicationFlaggedSet, Listing, Application, CronJob]),
    forwardRef(() => AuthModule),
    forwardRef(() => ListingsModule),
    SharedModule,
  ],
  controllers: [ApplicationFlaggedSetsController],
  providers: [
    ApplicationFlaggedSetsService,
    ApplicationFlaggedSetsCronjobService,
    CronJobService,
    Logger,
    SchedulerRegistry,
  ],
  exports: [ApplicationFlaggedSetsService, ApplicationFlaggedSetsCronjobService],
})
export class ApplicationFlaggedSetsModule {}
