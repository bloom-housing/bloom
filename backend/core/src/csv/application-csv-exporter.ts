import { Injectable } from "@nestjs/common"
import { CsvBuilder } from "./csv-builder.service"
import { Application } from "../applications/entities/application.entity"
import { applicationFormattingMetadataAggregateFactory } from "./formatting/application-formatting-metadata-factory"
import {
  formatDemographicsEthnicity,
  formatDemographicsGender,
  formatDemographicsHowDidYouHear,
  formatDemographicsRace,
  formatDemographicsSexualOrientation,
} from "./formatting/formatters"
import { CSVFormattingType } from "./types/csv-formatting-type-enum"

@Injectable()
export class ApplicationCsvExporter {
  constructor(private readonly csvBuilder: CsvBuilder) {}
  export(
    applications: Application[],
    csvFormattingType: CSVFormattingType,
    includeHeaders?: boolean,
    includeDemographics?: boolean
  ): string {
    return this.csvBuilder.build(
      applications,
      applicationFormattingMetadataAggregateFactory,
      // Every application points to the same listing
      csvFormattingType,
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
