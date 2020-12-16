import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { PreferencesController } from "../preferences/preferences.controller"
import { PreferencesService } from "./preferences.service"
import { Listing } from "../listings/entities/listing.entity"
import { Preference } from "./entities/preference.entity"
import { Unit } from "../units/entities/unit.entity"
import { Asset } from "../assets/entities/asset.entity"
import { ApplicationMethod } from "../application-methods/entities/application-method.entity"
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
