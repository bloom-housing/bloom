import { OmitType } from "@nestjs/swagger"
import { ApplicationFlaggedSet } from "../entities/application-flagged-set.entity"
import { Expose, Type } from "class-transformer"
import { ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ApplicationDto } from "../../applications/dto/application.dto"
import { IdDto } from "../../shared/dto/id.dto"

export class ApplicationFlaggedSetDto extends OmitType(ApplicationFlaggedSet, [
  "resolvingUser",
  "applications",
  "listing",
] as const) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  resolvingUser: IdDto

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicationDto)
  applications: ApplicationDto[]

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  listing: IdDto
}
