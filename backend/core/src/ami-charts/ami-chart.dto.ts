import { Expose, Type } from "class-transformer"
import { IsDate, IsDefined, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { OmitType } from "@nestjs/swagger"
import { AmiChart } from "../entity/ami-chart.entity"
import { AmiChartItem } from "../entity/ami-chart-item.entity"
import { ValidationsGroupsEnum } from "../shared/validations-groups.enum"

export class AmiChartItemDto extends OmitType(AmiChartItem, ["amiChart"]) {}

export class AmiChartItemCreateDto extends OmitType(AmiChartItemDto, [
  "id",
  "createdAt",
  "updatedAt",
]) {}

export class AmiChartItemUpdateDto extends OmitType(AmiChartItemDto, [
  "id",
  "createdAt",
  "updatedAt",
]) {
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

export class AmiChartDto extends OmitType(AmiChart, ["units", "items"] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AmiChartItemDto)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  items: AmiChartItemDto[]
}

export class AmiChartCreateDto extends OmitType(AmiChartDto, [
  "id",
  "createdAt",
  "updatedAt",
  "items",
] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AmiChartItemCreateDto)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  items: AmiChartItemCreateDto[]
}

export class AmiChartUpdateDto extends OmitType(AmiChartDto, [
  "id",
  "createdAt",
  "updatedAt",
  "items",
]) {
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

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AmiChartItemUpdateDto)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  items: AmiChartItemUpdateDto[]
}
