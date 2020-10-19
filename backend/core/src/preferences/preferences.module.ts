import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { PreferencesController } from "../preferences/preferences.controller"
import { PreferencesService } from "./preferences.service"
import { Listing } from "../entity/listing.entity"
import { Preference } from "../entity/preference.entity"
import { Unit } from "../entity/unit.entity"
import { Asset } from "../entity/asset.entity"
import { ApplicationMethod } from "../entity/application-method.entity"
import { AuthModule } from "../auth/auth.module"

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing, Preference, Unit, Asset, ApplicationMethod]),
    AuthModule,
  ],
  providers: [PreferencesService],
  exports: [PreferencesService],
  controllers: [PreferencesController],
})
export class PreferencesModule {}
