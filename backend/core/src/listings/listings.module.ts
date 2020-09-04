import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ListingsService } from "./listings.service"
import { ListingsController } from "./listings.controller"
import { Listing } from "../entity/listing.entity"
import { Unit } from "../entity/unit.entity"
import { Asset } from "../entity/asset.entity"
import { ApplicationMethod } from "../entity/application-method.entity"
import { Preference } from "../entity/preference.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Listing, Preference, Unit, Asset, ApplicationMethod])],
  providers: [ListingsService],
  exports: [ListingsService],
  controllers: [ListingsController],
})
export class ListingsModule {}
