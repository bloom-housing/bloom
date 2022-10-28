import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Application } from "./entities/application.entity"
import { ApplicationsController } from "./applications.controller"
import { AuthModule } from "../auth/auth.module"
import { SharedModule } from "../shared/shared.module"
import { ListingsModule } from "../listings/listings.module"
import { Address } from "../shared/entities/address.entity"
import { Applicant } from "./entities/applicant.entity"
import { ApplicationsSubmissionController } from "./applications-submission.controller"
import { TranslationsModule } from "../translations/translations.module"
import { Listing } from "../listings/entities/listing.entity"
import { ScheduleModule } from "@nestjs/schedule"
import { ApplicationsService } from "./services/applications.service"
import { CsvBuilder } from "./services/csv-builder.service"
import { ApplicationCsvExporterService } from "./services/application-csv-exporter.service"
import { EmailModule } from "../email/email.module"
import { ActivityLogModule } from "../activity-log/activity-log.module"
import { ListingRepository } from "../listings/db/listing.repository"

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, Applicant, Address, Listing, ListingRepository]),
    AuthModule,
    ActivityLogModule,
    SharedModule,
    ListingsModule,
    TranslationsModule,
    EmailModule,
    ScheduleModule.forRoot(),
  ],
  providers: [ApplicationsService, CsvBuilder, ApplicationCsvExporterService],
  exports: [ApplicationsService],
  controllers: [ApplicationsController, ApplicationsSubmissionController],
})
export class ApplicationsModule {}
