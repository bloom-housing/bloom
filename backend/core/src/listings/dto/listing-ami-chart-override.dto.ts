import { OmitType } from "@nestjs/swagger"
import { ListingAmiChartOverride } from "../entities/listing-ami-chart-override.entity"
import { Expose, Type } from "class-transformer"
import { IsDate, IsDefined, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { IdDto } from "../../shared/dto/id.dto"

export class ListingAmiChartOverrideDto extends OmitType(ListingAmiChartOverride, [
  "listing",
  "unit",
] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  unit: IdDto
}

export class ListingAmiChartOverrideCreateDto extends OmitType(ListingAmiChartOverrideDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}

export class ListingAmiChartOverrideUpdateDto extends OmitType(ListingAmiChartOverrideDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id?: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  createdAt?: Date

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  updatedAt?: Date
}
