import { CacheModule, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ListingsService } from "./listings.service"
import { ListingsController } from "./listings.controller"
import { Listing } from "./entities/listing.entity"
import { Unit } from "../units/entities/unit.entity"
import { Asset } from "../assets/entities/asset.entity"
import { ApplicationMethod } from "../application-methods/entities/application-method.entity"
import { Preference } from "../preferences/entities/preference.entity"
import { AuthModule } from "../auth/auth.module"
import { User } from "../user/entities/user.entity"

@Module({
  imports: [
    CacheModule.register({
      ttl: 24 * 60 * 60,
      max: 10,
    }),
    TypeOrmModule.forFeature([Listing, Preference, Unit, Asset, ApplicationMethod, User]),
    AuthModule,
  ],
  providers: [ListingsService],
  exports: [ListingsService],
  controllers: [ListingsController],
})
export class ListingsModule {}
