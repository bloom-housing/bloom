import { forwardRef, Logger, Module } from "@nestjs/common"
import { HttpModule } from "@nestjs/axios"
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ListingsService } from "./listings.service"
import { ListingsController } from "./listings.controller"
import { Listing } from "./entities/listing.entity"
import { Unit } from "../units/entities/unit.entity"
import { MultiselectQuestion } from "../multiselect-question/entities/multiselect-question.entity"
import { AuthModule } from "../auth/auth.module"
import { User } from "../auth/entities/user.entity"
import { TranslationsModule } from "../translations/translations.module"
import { AmiChart } from "../ami-charts/entities/ami-chart.entity"
import { ListingFeatures } from "./entities/listing-features.entity"
import { ActivityLogModule } from "../activity-log/activity-log.module"
import { ListingUtilities } from "./entities/listing-utilities.entity"
import { ApplicationFlaggedSetsModule } from "../application-flagged-sets/application-flagged-sets.module"
import { ListingsCronService } from "./listings-cron.service"
import { ListingsCsvExporterService } from "./listings-csv-exporter.service"
import { CsvBuilder } from "../../src/applications/services/csv-builder.service"
import { CachePurgeService } from "./cache-purge.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Listing,
      MultiselectQuestion,
      Unit,
      User,
      AmiChart,
      ListingFeatures,
      ListingUtilities,
    ]),
    forwardRef(() => AuthModule),
    TranslationsModule,
    ActivityLogModule,
    ApplicationFlaggedSetsModule,
    HttpModule,
    ConfigModule,
  ],
  providers: [
    ListingsService,
    ListingsCronService,
    Logger,
    CsvBuilder,
    ListingsCsvExporterService,
    CachePurgeService,
  ],
  exports: [ListingsService],
  controllers: [ListingsController],
})
export class ListingsModule {}
