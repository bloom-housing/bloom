import { Module } from '@nestjs/common';
import { ListingsController } from './listings/listings.controller';
import { ListingsService } from './listings/listings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from './entity/Listing';
import { Attachment } from './entity/Attachment';
import { Unit } from './entity/Unit';
import { Preference } from './entity/Preference';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "postgres",
    host: "localhost",
    port: 5432,
    database: "bloom",
    synchronize: true,
    logging: false,
    entities: [Listing, Attachment, Unit, Preference],
  }), TypeOrmModule.forFeature([Listing])],
  controllers: [ListingsController],
  providers: [ListingsService],
})
export class AppModule {}
