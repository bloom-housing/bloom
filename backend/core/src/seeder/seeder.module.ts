import { DynamicModule, Module } from "@nestjs/common"

import { TypeOrmModule } from "@nestjs/typeorm"
import dbOptions from "../../ormconfig"
import testDbOptions from "../../ormconfig.test"
import { ThrottlerModule } from "@nestjs/throttler"
import { SharedModule } from "../shared/shared.module"
import { AuthModule } from "../auth/auth.module"
import { ApplicationsModule } from "../applications/applications.module"
import { ListingsModule } from "../listings/listings.module"
import { AmiChartsModule } from "../ami-charts/ami-charts.module"
import { ListingDefaultSeed } from "../seeder/seeds/listings/listing-default-seed"
import { ListingDefaultSanJoseSeed } from "../seeder/seeds/listings/listing-default-sanjose-seed"
import { Listing } from "../listings/entities/listing.entity"
import { UnitAccessibilityPriorityType } from "../unit-accessbility-priority-types/entities/unit-accessibility-priority-type.entity"
import { ReservedCommunityType } from "../reserved-community-type/entities/reserved-community-type.entity"
import { UnitType } from "../unit-types/entities/unit-type.entity"
import { UnitRentType } from "../unit-rent-types/entities/unit-rent-type.entity"
import { AmiChart } from "../ami-charts/entities/ami-chart.entity"
import { Unit } from "../units/entities/unit.entity"
import { User } from "../auth/entities/user.entity"
import { UserRoles } from "../auth/entities/user-roles.entity"
import { ListingColiseumSeed } from "../seeder/seeds/listings/listing-coliseum-seed"
import { ListingDefaultOnePreferenceSeed } from "../seeder/seeds/listings/listing-default-one-preference-seed"
import { ListingDefaultNoPreferenceSeed } from "../seeder/seeds/listings/listing-default-no-preference-seed"
import { MultiselectQuestion } from "../multiselect-question/entities/multiselect-question.entity"
import { ListingDefaultDraftSeed } from "./seeds/listings/listing-default-draft"
import { ListingDefaultFCFSSeed } from "../seeder/seeds/listings/listing-default-fcfs-seed"
import { ListingDefaultOpenSoonSeed } from "../seeder/seeds/listings/listing-default-open-soon"
import { ListingTritonSeed } from "../seeder/seeds/listings/listing-triton-seed"
import { ListingDefaultBmrChartSeed } from "../seeder/seeds/listings/listing-default-bmr-chart-seed"
import { ApplicationMethod } from "../application-methods/entities/application-method.entity"
import { PaperApplication } from "../paper-applications/entities/paper-application.entity"
import { ApplicationMethodsModule } from "../application-methods/applications-methods.module"
import { PaperApplicationsModule } from "../paper-applications/paper-applications.module"
import { AssetsModule } from "../assets/assets.module"
import { ListingDefaultReservedSeed } from "../seeder/seeds/listings/listing-default-reserved-seed"
import { ListingDefaultMultipleAMI } from "../seeder/seeds/listings/listing-default-multiple-ami"
import { ListingDefaultMultipleAMIAndPercentages } from "../seeder/seeds/listings/listing-default-multiple-ami-and-percentages"
import { ListingDefaultLottery } from "./seeds/listings/listing-default-lottery-results"
import { ListingDefaultLotteryPending } from "./seeds/listings/listing-default-lottery-pending"
import { ListingDefaultMissingAMI } from "../seeder/seeds/listings/listing-default-missing-ami"
import { UnitTypesModule } from "../unit-types/unit-types.module"
import { Jurisdiction } from "../jurisdictions/entities/jurisdiction.entity"
import { AmiChartDefaultSeed } from "../seeder/seeds/ami-charts/default-ami-chart"
import { AmiDefaultMissingAMI } from "../seeder/seeds/ami-charts/missing-household-ami-levels"
import { AmiDefaultTriton } from "../seeder/seeds/ami-charts/triton-ami-chart"
import { AmiDefaultSanJose } from "../seeder/seeds/ami-charts/default-ami-chart-san-jose"
import { AmiDefaultSanMateo } from "../seeder/seeds/ami-charts/default-ami-chart-san-mateo"
import { Asset } from "../assets/entities/asset.entity"

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
          Asset,
          Listing,
          MultiselectQuestion,
          UnitAccessibilityPriorityType,
          UnitType,
          ReservedCommunityType,
          UnitRentType,
          AmiChart,
          Unit,
          User,
          UserRoles,
          ApplicationMethod,
          PaperApplication,
          Jurisdiction,
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
        ListingDefaultDraftSeed,
        ListingDefaultFCFSSeed,
        ListingDefaultOpenSoonSeed,
        ListingDefaultBmrChartSeed,
        ListingTritonSeed,
        ListingDefaultReservedSeed,
        ListingDefaultFCFSSeed,
        ListingDefaultMultipleAMI,
        ListingDefaultMultipleAMIAndPercentages,
        ListingDefaultMissingAMI,
        ListingDefaultLottery,
        ListingDefaultLotteryPending,
        ListingDefaultSanJoseSeed,
        AmiChartDefaultSeed,
        AmiDefaultMissingAMI,
        AmiDefaultTriton,
        AmiDefaultSanJose,
        AmiDefaultSanMateo,
      ],
    }
  }
}
