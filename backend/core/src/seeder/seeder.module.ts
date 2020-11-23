import { DynamicModule, Module } from "@nestjs/common"
import { UserModule } from "../user/user.module"
import { Listing } from "../entity/listing.entity"
import { Unit } from "../entity/unit.entity"
import { Application } from "../applications/entities/application.entity"

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
import { PropertyGroup } from "../entity/property-group.entity"
import { ApplicationMethod } from "../entity/application-method.entity"
import { Preference } from "../entity/preference.entity"
import { Property } from "../entity/property.entity"
import { Asset } from "../entity/asset.entity"
import { ListingEvent } from "../entity/listing-event.entity"
import { AmiChart } from "../entity/ami-chart.entity"

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
        TypeOrmModule.forFeature([
          Asset,
          Listing,
          Unit,
          Application,
          User,
          Property,
          PropertyGroup,
          Preference,
          ApplicationMethod,
          ListingEvent,
          AmiChart,
        ]),
      ],
      providers: [UserService, ListingsService, ApplicationsService, CsvBuilder, CsvEncoder],
    }
  }
}
