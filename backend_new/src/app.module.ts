import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AmiChartModule } from './modules/ami-chart.module';
import { ListingModule } from './modules/listing.module';

@Module({
  imports: [ListingModule, AmiChartModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [ListingModule, AmiChartModule],
})
export class AppModule {}
