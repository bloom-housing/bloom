import { Logger, Module } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { PrismaModule } from './prisma.module';
import { AmiChartModule } from './ami-chart.module';
import { ListingModule } from './listing.module';
import { ReservedCommunityTypeModule } from './reserved-community-type.module';
import { UnitAccessibilityPriorityTypeServiceModule } from './unit-accessibility-priority-type.module';
import { UnitTypeModule } from './unit-type.module';
import { UnitRentTypeModule } from './unit-rent-type.module';
import { JurisdictionModule } from './jurisdiction.module';
import { MultiselectQuestionModule } from './multiselect-question.module';
import { ApplicationModule } from './application.module';
import { AssetModule } from './asset.module';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { ApplicationFlaggedSetModule } from './application-flagged-set.module';
import { MapLayerModule } from './map-layer.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottleGuard } from '../guards/throttler.guard';
import { ScirptRunnerModule } from './script-runner.module';
import { LotteryModule } from './lottery.module';
import { FeatureFlagModule } from './feature-flag.module';

@Module({
  imports: [
    ListingModule,
    AmiChartModule,
    ReservedCommunityTypeModule,
    UnitTypeModule,
    UnitAccessibilityPriorityTypeServiceModule,
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
    ScirptRunnerModule,
    LotteryModule,
    FeatureFlagModule,
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
    ListingModule,
    AmiChartModule,
    ReservedCommunityTypeModule,
    UnitTypeModule,
    UnitAccessibilityPriorityTypeServiceModule,
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
    ScirptRunnerModule,
    LotteryModule,
    FeatureFlagModule,
  ],
})
export class AppModule {}
