import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AmiChartModule } from './modules/ami-chart.module';
import { ListingModule } from './modules/listing.module';
import { ReservedCommunityTypeModule } from './modules/reserved-community-type.module';
import { UnitAccessibilityPriorityTypeServiceModule } from './modules/unit-accessibility-priority-type.module';
import { UnitTypeModule } from './modules/unit-type.module';
import { UnitRentTypeModule } from './modules/unit-rent-type.module';
import { JurisdictionModule } from './modules/jurisdiction.module';
import { AssetModule } from './modules/asset.module';

@Module({
  imports: [
    ListingModule,
    AmiChartModule,
    ReservedCommunityTypeModule,
    UnitTypeModule,
    UnitAccessibilityPriorityTypeServiceModule,
    UnitRentTypeModule,
    JurisdictionModule,
    AssetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [
    ListingModule,
    AmiChartModule,
    ReservedCommunityTypeModule,
    UnitTypeModule,
    UnitAccessibilityPriorityTypeServiceModule,
    UnitRentTypeModule,
    JurisdictionModule,
    AssetModule,
  ],
})
export class AppModule {}
