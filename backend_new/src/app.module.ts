import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ListingModule } from './modules/listing.module';

@Module({
  imports: [ListingModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [ListingModule],
})
export class AppModule {}
