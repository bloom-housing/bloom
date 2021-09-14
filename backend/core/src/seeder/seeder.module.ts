import { DynamicModule, Module } from "@nestjs/common"

import { TypeOrmModule } from "@nestjs/typeorm"
import dbOptions = require("../../ormconfig")
import testDbOptions = require("../../ormconfig.test")
import { ThrottlerModule } from "@nestjs/throttler"
import { SharedModule } from "../shared/shared.module"
import { AuthModule } from "../auth/auth.module"
import { ApplicationsModule } from "../applications/applications.module"
import { ListingsModule } from "../listings/listings.module"
import { AmiChartsModule } from "../ami-charts/ami-charts.module"
import { ListingDefaultSeed } from "../seeds/listings/listing-default-seed"
import { Listing } from "../listings/entities/listing.entity"
import { UnitAccessibilityPriorityType } from "../unit-accessbility-priority-types/entities/unit-accessibility-priority-type.entity"
import { ReservedCommunityType } from "../reserved-community-type/entities/reserved-community-type.entity"
import { UnitType } from "../unit-types/entities/unit-type.entity"
import { UnitRentType } from "../unit-rent-types/entities/unit-rent-type.entity"
import { AmiChart } from "../ami-charts/entities/ami-chart.entity"
import { Property } from "../property/entities/property.entity"
import { Unit } from "../units/entities/unit.entity"
import { User } from "../auth/entities/user.entity"
import { UserRoles } from "../auth/entities/user-roles.entity"
import { ListingColiseumSeed } from "../seeds/listings/listing-coliseum-seed"
import { ListingDefaultOnePreferenceSeed } from "../seeds/listings/listing-default-one-preference-seed"
import { ListingDefaultNoPreferenceSeed } from "../seeds/listings/listing-default-no-preference-seed"
import { Preference } from "../preferences/entities/preference.entity"
import { ListingDefaultFCFSSeed } from "../seeds/listings/listing-default-fcfs-seed"
import { ListingDefaultOpenSoonSeed } from "../seeds/listings/listing-default-open-soon"
import { ListingTritonSeed } from "../seeds/listings/listing-triton-seed"
import { ListingDefaultBmrChartSeed } from "../seeds/listings/listing-default-bmr-chart-seed"
import { ApplicationMethod } from "../application-methods/entities/application-method.entity"
import { PaperApplication } from "../paper-applications/entities/paper-application.entity"
import { ApplicationMethodsModule } from "../application-methods/applications-methods.module"
import { PaperApplicationsModule } from "../paper-applications/paper-applications.module"
import { AssetsModule } from "../assets/assets.module"
import { ListingDefaultReservedSeed } from "../seeds/listings/listing-default-reserved-seed"
import { ListingDefaultMultipleAMI } from "../seeds/listings/listing-default-multiple-ami"
import { ListingDefaultMultipleAMIAndPercentages } from "../seeds/listings/listing-default-multiple-ami-and-percentages"
import { ListingDefaultMissingAMI } from "../seeds/listings/listing-default-missing-ami"
import { UnitTypesModule } from "../unit-types/unit-types.module"

@Module({})
export class SeederModule {
  static forRoot(options: { test: boolean }): DynamicModule {
    const dbConfig = options.test ? testDbOptions : dbOptions
    return {
      module: SeederModule,
      imports: [
        AssetsModule,
        SharedModule,
        TypeOrmModule.forRoot({
          ...dbConfig,
        }),
        TypeOrmModule.forFeature([
          Listing,
          Preference,
          UnitAccessibilityPriorityType,
          UnitType,
          ReservedCommunityType,
          UnitRentType,
          AmiChart,
          Property,
          Unit,
          User,
          UserRoles,
          ApplicationMethod,
          PaperApplication,
        ]),
        ThrottlerModule.forRoot({
          ttl: 60,
          limit: 5,
          ignoreUserAgents: [/^node-superagent.*$/],
        }),
        ApplicationsModule,
        ApplicationMethodsModule,
        PaperApplicationsModule,
        AuthModule,
        ListingsModule,
        AmiChartsModule,
        UnitTypesModule,
      ],
      providers: [
        ListingDefaultSeed,
        ListingColiseumSeed,
        ListingDefaultOnePreferenceSeed,
        ListingDefaultNoPreferenceSeed,
        ListingDefaultFCFSSeed,
        ListingDefaultOpenSoonSeed,
        ListingDefaultBmrChartSeed,
        ListingTritonSeed,
        ListingDefaultReservedSeed,
        ListingDefaultFCFSSeed,
        ListingDefaultMultipleAMI,
        ListingDefaultMultipleAMIAndPercentages,
        ListingDefaultMissingAMI,
      ],
    }
  }
}
