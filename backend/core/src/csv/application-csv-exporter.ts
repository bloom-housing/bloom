import { Injectable } from "@nestjs/common"
import { CsvBuilder } from "./csv-builder.service"
import { Application } from "../applications/entities/application.entity"

@Injectable()
export class ApplicationCsvExporter {
  constructor(private readonly csvBuilder: CsvBuilder) {}
  export(applications: Application[], includeDemographics?: boolean): string {
    return this.csvBuilder.build(applications, includeDemographics)
  }
}
