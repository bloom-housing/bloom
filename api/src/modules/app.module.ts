import { AgencyModule } from './agency.module';
import { AmiChartModule } from './ami-chart.module';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from '../controllers/app.controller';
import { ApplicationFlaggedSetModule } from './application-flagged-set.module';
import { ApplicationModule } from './application.module';
import { AppService } from '../services/app.service';
import { AssetModule } from './asset.module';
import { AuthModule } from './auth.module';
import { CronJobModule } from './cron-job.module';
import { FeatureFlagModule } from './feature-flag.module';
import { JurisdictionModule } from './jurisdiction.module';
import { ListingModule } from './listing.module';
import { Logger, Module } from '@nestjs/common';
import { LotteryModule } from './lottery.module';
import { MapLayerModule } from './map-layer.module';
import { MultiselectQuestionModule } from './multiselect-question.module';
import { PrismaModule } from './prisma.module';
import { PropertyModule } from './property.module';
import { ReservedCommunityTypeModule } from './reserved-community-type.module';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ScriptRunnerModule } from './script-runner.module';
import { SnapshotCreateModule } from './snapshot-create.module';
import { ThrottleGuard } from '../guards/throttler.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { UnitRentTypeModule } from './unit-rent-type.module';
import { UnitTypeModule } from './unit-type.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    ListingModule,
    AmiChartModule,
    ReservedCommunityTypeModule,
    UnitTypeModule,
    UnitRentTypeModule,
    JurisdictionModule,
    MultiselectQuestionModule,
    ApplicationModule,
    AssetModule,
    UserModule,
    PrismaModule,
    AuthModule,
    ApplicationFlaggedSetModule,
    MapLayerModule,
    ScriptRunnerModule,
    LotteryModule,
    FeatureFlagModule,
    CronJobModule,
    PropertyModule,
    AgencyModule,
    SnapshotCreateModule,
    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.THROTTLE_TTL),
        limit: Number(process.env.THROTTLE_LIMIT),
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    SchedulerRegistry,
    {
      provide: APP_GUARD,
      useClass: ThrottleGuard,
    },
  ],
  exports: [
    PropertyModule,
    AgencyModule,
    ListingModule,
    AmiChartModule,
    ReservedCommunityTypeModule,
    UnitTypeModule,
    UnitRentTypeModule,
    JurisdictionModule,
    MultiselectQuestionModule,
    ApplicationModule,
    AssetModule,
    UserModule,
    PrismaModule,
    AuthModule,
    ApplicationFlaggedSetModule,
    MapLayerModule,
    ScriptRunnerModule,
    LotteryModule,
    FeatureFlagModule,
    SnapshotCreateModule,
  ],
})
export class AppModule {}
