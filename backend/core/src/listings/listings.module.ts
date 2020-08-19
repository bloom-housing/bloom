import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ListingsService } from "./listings.service"
import { ListingsController } from "./listings.controller"
import { Listing } from "../entity/listing.entity"
import { Attachment } from "../entity/attachment.entity"
import { Preference } from "../entity/preference.entity"
import { Unit } from "../entity/unit.entity"
import { ListingTranslation } from "../entity/listing-translation.entity"
import { PreferenceTranslation } from "../entity/preference-translation.entity"

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Listing,
      Attachment,
      Preference,
      Unit,
      ListingTranslation,
      PreferenceTranslation,
    ]),
  ],
  providers: [ListingsService],
  exports: [ListingsService],
  controllers: [ListingsController],
})
export class ListingsModule {}
