import { OmitType } from "@nestjs/swagger"
import { ApplicationFlaggedSet } from "../entities/application-flagged-set.entity"
import { Expose, Type } from "class-transformer"
import { ArrayMaxSize, IsArray, IsDefined, IsUUID, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ApplicationDto } from "../../applications/dto/application.dto"
import { PaginationFactory, PaginationMeta } from "../../shared/dto/pagination.dto"
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

export class ApplicationFlaggedSetPaginationMeta extends PaginationMeta {
  @Expose()
  totalFlagged: number
}

export class PaginatedApplicationFlaggedSetDto extends PaginationFactory<ApplicationFlaggedSetDto>(
  ApplicationFlaggedSetDto
) {
  @Expose()
  meta: ApplicationFlaggedSetPaginationMeta
}

export class ApplicationFlaggedSetResolveDto {
  @Expose()
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  afsId: string

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(512, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  applications: IdDto[]
}
