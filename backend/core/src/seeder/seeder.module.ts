import { DynamicModule, Module } from "@nestjs/common"
import { UserModule } from "../user/user.module"
import { Listing } from "../listings/entities/listing.entity"
import { Unit } from "../units/entities/unit.entity"
import { Application } from "../applications/entities/application.entity"

import { TypeOrmModule } from "@nestjs/typeorm"
import { UserService } from "../user/user.service"
import { User } from "../user/entities/user.entity"
import { ListingsService } from "../listings/listings.service"
import { ApplicationsService } from "../applications/applications.service"
import dbOptions = require("../../ormconfig")
import testDbOptions = require("../../ormconfig.test")
import { ConfigModule } from "@nestjs/config"
import { CsvBuilder } from "../services/csv-builder.service"
import { CsvEncoder } from "../services/csv-encoder.service"
import { PropertyGroup } from "../property-groups/entities/property-group.entity"
import { ApplicationMethod } from "../application-methods/entities/application-method.entity"
import { Preference } from "../preferences/entities/preference.entity"
import { Property } from "../property/entities/property.entity"
import { Asset } from "../assets/entities/asset.entity"
import { ListingEvent } from "../listing-events/entities/listing-event.entity"
import { AmiChart } from "../ami-charts/entities/ami-chart.entity"

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
