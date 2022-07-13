import { Module } from "@nestjs/common"
import { ApplicationFlaggedSetsController } from "./application-flagged-sets.controller"
import { ApplicationFlaggedSetsService } from "./application-flagged-sets.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "../auth/auth.module"
import { ApplicationFlaggedSet } from "./entities/application-flagged-set.entity"
import { Application } from "../applications/entities/application.entity"
import { ApplicationFlaggedSetsCronjobBoostrapService } from "./application-flagged-sets-cronjob-boostrap.service"
import { ApplicationFlaggedSetsCronjobConsumer } from "./application-flagged-sets-cronjob-consumer"
import { BullModule } from "@nestjs/bull"
import { AFSProcessingQueueNames } from "./constants/applications-flagged-sets-constants"
import { ConfigService } from "@nestjs/config"
import { SharedModule } from "../shared/shared.module"
import { ListingRepository } from "../listings/repositories/listing.repository"

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicationFlaggedSet, Application, ListingRepository]),
    AuthModule,
    BullModule.forRootAsync({
      imports: [SharedModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisUrl = new URL(configService.get<string>("REDIS_TLS_URL"))
        return {
          redis: {
            host: redisUrl.hostname,
            port: +redisUrl.port,
          },
        }
      }
    }),
    BullModule.registerQueue({
      name: AFSProcessingQueueNames.afsProcessing,
    }),
    SharedModule,
  ],
  controllers: [ApplicationFlaggedSetsController],
  providers: [
    ApplicationFlaggedSetsService,
    ApplicationFlaggedSetsCronjobBoostrapService,
    ApplicationFlaggedSetsCronjobConsumer,
  ],
  exports: [ApplicationFlaggedSetsService, ApplicationFlaggedSetsCronjobBoostrapService, ApplicationFlaggedSetsCronjobConsumer],
})
export class ApplicationFlaggedSetsModule {}
