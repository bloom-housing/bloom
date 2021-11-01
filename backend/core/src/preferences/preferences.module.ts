import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { PreferencesController } from "../preferences/preferences.controller"
import { PreferencesService } from "./preferences.service"
import { Preference } from "./entities/preference.entity"
import { Unit } from "../units/entities/unit.entity"
import { AuthModule } from "../auth/auth.module"

@Module({
  imports: [TypeOrmModule.forFeature([Preference, Unit]), AuthModule],
  providers: [PreferencesService],
  exports: [PreferencesService],
  controllers: [PreferencesController],
})
export class PreferencesModule {}
