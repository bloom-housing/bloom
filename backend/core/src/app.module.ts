import { Module } from "@nestjs/common"
import { ListingsController } from "./listings/listings.controller"
import { ListingsService } from "./listings/listings.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Listing } from "./entity/Listing"
import { Attachment } from "./entity/Attachment"
import { Unit } from "./entity/Unit"
import { Preference } from "./entity/Preference"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../ormconfig")

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dbOptions,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Listing, Attachment, Preference, Unit]),
  ],
  controllers: [ListingsController],
  providers: [ListingsService],
})
export class AppModule {}
