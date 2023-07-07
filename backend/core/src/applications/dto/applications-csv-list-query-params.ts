import { PaginatedApplicationListQueryParams } from "./paginated-application-list-query-params"
import { Expose, Transform } from "class-transformer"
import { ApiProperty, OmitType } from "@nestjs/swagger"
import { IsBoolean, IsOptional, IsString, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class ApplicationsCsvListQueryParams extends OmitType(PaginatedApplicationListQueryParams, [
  "listingId",
]) {
  @Expose()
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsUUID()
  listingId: string

  @Expose()
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  timeZone?: string

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value: string | boolean | undefined) => {
      return value === "true" || value === true
    },
    { toClassOnly: true }
  )
  includeDemographics?: boolean
}

export class RawApplicationsListQueryParams extends OmitType(ApplicationsCsvListQueryParams, [
  "search",
  "userId",
  "orderBy",
  "order",
  "markedAsDuplicate",
  "page",
  "limit",
]) {}
