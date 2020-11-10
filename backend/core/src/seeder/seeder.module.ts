import { DynamicModule, Module } from "@nestjs/common"
import { ListingsSeederService } from "./listings-seeder/listings-seeder.service"
import { UserModule } from "../user/user.module"
import { Listing } from "../entity/listing.entity"
import { Unit } from "../entity/unit.entity"
import { Application } from "../entity/application.entity"

import { TypeOrmModule } from "@nestjs/typeorm"
import { UserService } from "../user/user.service"
import { User } from "../entity/user.entity"
import { ListingsService } from "../listings/listings.service"
import { ApplicationsService } from "../applications/applications.service"
import dbOptions = require("../../ormconfig")
import testDbOptions = require("../../ormconfig.test")
import { ConfigModule } from "@nestjs/config"
import { CsvBuilder } from "../services/csv-builder.service"
import { CsvEncoder } from "../services/csv-encoder.service"

@Module({})
export class SeederModule {
  static forRoot(options: { test: boolean }): DynamicModule {
    const dbConfig = options.test ? testDbOptions : dbOptions
    return {
      module: SeederModule,
      imports: [
        UserModule,
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          ...dbConfig,
        }),
        TypeOrmModule.forFeature([Listing, Unit, Application, User]),
      ],
      providers: [
        ListingsSeederService,
        UserService,
        ListingsService,
        ApplicationsService,
        CsvBuilder,
        CsvEncoder,
      ],
    }
  }
}
