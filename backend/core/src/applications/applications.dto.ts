import { IsDefined, ValidateNested } from "class-validator"
import { IdDto } from "../lib/id.dto"
import { Expose, Type } from "class-transformer"
import { OmitType } from "@nestjs/swagger"
import { Application } from "../entity/application.entity"

export class ApplicationDto extends OmitType(Application, ["listing", "user"] as const) {
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => IdDto)
  listing: IdDto
}
