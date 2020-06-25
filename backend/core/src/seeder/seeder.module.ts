import { Module } from "@nestjs/common"
import { ListingsSeederService } from "./listings-seeder/listings-seeder.service"
import { UserModule } from "../user/user.module"
import { Listing } from "../entity/listing.entity"
import { Attachment } from "../entity/attachment.entity"
import { Preference } from "../entity/preference.entity"
import { Unit } from "../entity/unit.entity"
import { Application } from "../entity/application.entity"

import dbOptions = require("../../ormconfig")
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserService } from "../user/user.service"
import { User } from "../entity/user.entity"
import { ListingsService } from "../listings/listings.service"
import { UserApplicationsService } from "../user-applications/user-applications.service"

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      ...dbOptions,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Listing, Attachment, Preference, Unit, Application, User]),
  ],
  providers: [ListingsSeederService, UserService, ListingsService, UserApplicationsService],
})
export class SeederModule {}
