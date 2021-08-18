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
import { Listing10158Seed } from "../seeds/listings/listing-detroit-10158"
import { Listing10157Seed } from "../seeds/listings/listing-detroit-10157"
import { Listing10147Seed } from "../seeds/listings/listing-detroit-10147"
import { Listing10145Seed } from "../seeds/listings/listing-detroit-10145"
import { ListingTreymoreSeed } from "../seeds/listings/listing-detroit-treymore"
import { UnitsSummary } from "../units-summary/entities/units-summary.entity"

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
          UnitsSummary,
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
        Listing10158Seed,
        Listing10157Seed,
        Listing10147Seed,
        Listing10145Seed,
        ListingTreymoreSeed,
      ],
    }
  }
}
