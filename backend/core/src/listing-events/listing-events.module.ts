import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "../auth/auth.module"
import { ListingEvent } from "../entity/listing-event.entity"
import { ListingEventsService } from "./listing-events.service"
import { ListingEventsController } from "./listing-events.controller"

@Module({
  imports: [TypeOrmModule.forFeature([ListingEvent]), AuthModule],
  providers: [ListingEventsService],
  exports: [ListingEventsService],
  controllers: [ListingEventsController],
})
export class ListingEventsModule {}
