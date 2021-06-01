import { DynamicModule, Module } from "@nestjs/common"
import { UserModule } from "../v1/user/user.module"
import { Listing } from "../v1/listings/entities/listing.entity"
import { Unit } from "../v1/units/entities/unit.entity"
import { Application } from "../v1/applications/entities/application.entity"

import { TypeOrmModule } from "@nestjs/typeorm"
import { UserService } from "../v1/user/user.service"
import { User } from "../v1/user/entities/user.entity"
import { ListingsService } from "../v1/listings/listings.service"
import dbOptions = require("../../ormconfig")
import testDbOptions = require("../../ormconfig.test")
import { ConfigModule } from "@nestjs/config"
import { CsvBuilder } from "../v1/csv/csv-builder.service"
import { CsvEncoder } from "../v1/csv/csv-encoder.service"
import { PropertyGroup } from "../v1/property-groups/entities/property-group.entity"
import { Preference } from "../v1/preferences/entities/preference.entity"
import { Property } from "../v1/property/entities/property.entity"
import { AmiChart } from "../v1/ami-charts/entities/ami-chart.entity"
import { ApplicationFlaggedSetsService } from "../v1/application-flagged-sets/application-flagged-sets.service"
import { AuthzService } from "../v1/auth/authz.service"
import { ApplicationFlaggedSet } from "../v1/application-flagged-sets/entities/application-flagged-set.entity"
import { ApplicationsModule } from "../v1/applications/applications.module"
import { ThrottlerModule } from "@nestjs/throttler"

@Module({})
export class SeederModule {
  static forRoot(options: { test: boolean }): DynamicModule {
    const dbConfig = options.test ? testDbOptions : dbOptions
    return {
      module: SeederModule,
      imports: [
        ApplicationsModule,
        UserModule,
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          ...dbConfig,
        }),
        ThrottlerModule.forRoot({
          ttl: 60,
          limit: 5,
          ignoreUserAgents: [/^node-superagent.*$/],
        }),
        TypeOrmModule.forFeature([
          Listing,
          Unit,
          Application,
          User,
          Property,
          PropertyGroup,
          Preference,
          AmiChart,
          ApplicationFlaggedSet,
        ]),
      ],
      providers: [
        AuthzService,
        ApplicationFlaggedSetsService,
        UserService,
        ListingsService,
        CsvBuilder,
        CsvEncoder,
      ],
    }
  }
}
