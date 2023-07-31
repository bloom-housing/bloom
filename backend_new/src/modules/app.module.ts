import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { AmiChartModule } from './ami-chart.module';
import { ListingModule } from './listing.module';
import { ReservedCommunityTypeModule } from './reserved-community-type.module';
import { UnitAccessibilityPriorityTypeServiceModule } from './unit-accessibility-priority-type.module';
import { UnitTypeModule } from './unit-type.module';
import { UnitRentTypeModule } from './unit-rent-type.module';
import { JurisdictionModule } from './jurisdiction.module';
import { MultiselectQuestionModule } from './multiselect-question.module';

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
    MultiselectQuestionModule,
  ],
})
export class AppModule {}
