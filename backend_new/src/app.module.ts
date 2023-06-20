import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AmiChartModule } from './modules/ami-chart.module';
import { ListingModule } from './modules/listing.module';
import { ReservedCommunityTypeModule } from './modules/reserved-community-type.module';

@Module({
  imports: [ListingModule, AmiChartModule, ReservedCommunityTypeModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [ListingModule, AmiChartModule, ReservedCommunityTypeModule],
})
export class AppModule {}
