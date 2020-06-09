import { Module } from "@nestjs/common"
import { ListingsController } from "./listings/listings.controller"
import { ListingsService } from "./listings/listings.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ListingEntity } from "./entity/listing.entity"
import { AttachmentEntity } from "./entity/attachment.entity"
import { UnitEntity } from "./entity/unit.entity"
import { PreferenceEntity } from "./entity/preference.entity"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../ormconfig")

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dbOptions,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([ListingEntity, AttachmentEntity, PreferenceEntity, UnitEntity]),
  ],
  controllers: [ListingsController],
  providers: [ListingsService],
})
export class AppModule {}
