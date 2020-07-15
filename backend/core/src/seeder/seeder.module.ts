import { DynamicModule, Module } from "@nestjs/common"
import { ListingsSeederService } from "./listings-seeder/listings-seeder.service"
import { UserModule } from "../user/user.module"
import { Listing } from "../entity/listing.entity"
import { Attachment } from "../entity/attachment.entity"
import { Preference } from "../entity/preference.entity"
import { Unit } from "../entity/unit.entity"
import { Application } from "../entity/application.entity"

import { TypeOrmModule } from "@nestjs/typeorm"
import { UserService } from "../user/user.service"
import { User } from "../entity/user.entity"
import { ListingsService } from "../listings/listings.service"
import { ApplicationsService } from "../applications/applications.service"
import dbOptions = require("../../ormconfig")
import testDbOptions = require("../../ormconfig.test")

@Module({})
export class SeederModule {
  static forRoot(options: { test: boolean }): DynamicModule {
    const dbConfig = options.test ? testDbOptions : dbOptions
    return {
      module: SeederModule,
      imports: [
        UserModule,
        TypeOrmModule.forRoot({
          ...dbConfig,
        }),
        TypeOrmModule.forFeature([Listing, Attachment, Preference, Unit, Application, User]),
      ],
      providers: [ListingsSeederService, UserService, ListingsService, ApplicationsService],
    }
  }
}
