import { Injectable } from "@nestjs/common"
import { CsvBuilder } from "./csv-builder.service"
import { Application } from "../applications/entities/application.entity"
import {
  applicationFormattingMetadataAggregateFactory,
  CSVFormattingType,
} from "./formatting/application-formatting-metadata-factory"
import {
  formatDemographicsEthnicity,
  formatDemographicsGender,
  formatDemographicsHowDidYouHear,
  formatDemographicsRace,
  formatDemographicsSexualOrientation,
} from "./formatting/format-blocks"

@Injectable()
export class ApplicationCsvExporter {
  constructor(private readonly csvBuilder: CsvBuilder) {}
  export(
    applications: Application[],
    includeHeaders?: boolean,
    includeDemographics?: boolean
  ): string {
    return this.csvBuilder.build(
      applications,
      applicationFormattingMetadataAggregateFactory,
      // Every application points to the same listing
      applications.length ? applications[0].listing.CSVFormattingType : CSVFormattingType.basic,
      includeHeaders,
      includeDemographics
        ? [
            formatDemographicsEthnicity,
            formatDemographicsRace,
            formatDemographicsGender,
            formatDemographicsSexualOrientation,
            formatDemographicsHowDidYouHear,
          ]
        : []
    )
  }
}
