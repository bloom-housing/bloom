import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ListingsService } from "./listings.service"
import { ListingsController } from "./listings.controller"
import { Listing } from "./entities/listing.entity"
import { Unit } from "../units/entities/unit.entity"
import { Preference } from "../preferences/entities/preference.entity"
import { AuthModule } from "../auth/auth.module"
import { User } from "../auth/entities/user.entity"
import { Property } from "../property/entities/property.entity"
import { TranslationsModule } from "../translations/translations.module"
import { AmiChart } from "../ami-charts/entities/ami-chart.entity"
import { ActivityLogModule } from "../activity-log/activity-log.module"
import { ListingRepository } from "./repositories/listing.repository"

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing, Preference, Unit, User, Property, AmiChart, ListingRepository]),
    AuthModule,
    TranslationsModule,
    ActivityLogModule,
  ],
  providers: [ListingsService],
  exports: [ListingsService],
  controllers: [ListingsController],
})
// We have to manually disconnect from redis on app close
export class ListingsModule {}
