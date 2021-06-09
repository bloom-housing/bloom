import { DynamicModule, Module } from "@nestjs/common"
import { UserModule } from "../user/user.module"
import { Listing } from "../listings/entities/listing.entity"
import { Unit } from "../units/entities/unit.entity"
import { Application } from "../applications/entities/application.entity"

import { TypeOrmModule } from "@nestjs/typeorm"
import { UserService } from "../user/user.service"
import { User } from "../user/entities/user.entity"
import { ListingsService } from "../listings/listings.service"
import dbOptions = require("../../ormconfig")
import testDbOptions = require("../../ormconfig.test")
import { CsvBuilder } from "../csv/csv-builder.service"
import { CsvEncoder } from "../csv/csv-encoder.service"
import { PropertyGroup } from "../property-groups/entities/property-group.entity"
import { Preference } from "../preferences/entities/preference.entity"
import { Property } from "../property/entities/property.entity"
import { AmiChart } from "../ami-charts/entities/ami-chart.entity"
import { ApplicationFlaggedSetsService } from "../application-flagged-sets/application-flagged-sets.service"
import { AuthzService } from "../auth/authz.service"
import { ApplicationFlaggedSet } from "../application-flagged-sets/entities/application-flagged-set.entity"
import { ApplicationsModule } from "../applications/applications.module"
import { ThrottlerModule } from "@nestjs/throttler"
import { SharedModule } from "../shared/shared.module"

@Module({})
export class SeederModule {
  static forRoot(options: { test: boolean }): DynamicModule {
    const dbConfig = options.test ? testDbOptions : dbOptions
    return {
      module: SeederModule,
      imports: [
        ApplicationsModule,
        UserModule,
        SharedModule,
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
