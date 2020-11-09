import { Expose, Type } from "class-transformer"
import { IsDateString, IsDefined, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { OmitType } from "@nestjs/swagger"
import { AmiChart } from "../entity/ami-chart.entity"
import { AmiChartItem } from "../entity/ami-chart-item.entity"

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
  @IsOptional()
  @IsUUID()
  id?: string

  @Expose()
  @IsOptional()
  @IsDateString()
  createdAt?: Date

  @Expose()
  @IsOptional()
  @IsDateString()
  updatedAt?: Date
}

export class AmiChartDto extends OmitType(AmiChart, ["properties", "items"] as const) {
  @Expose()
  @IsDefined()
  @Type(() => AmiChartItemDto)
  @ValidateNested({ each: true })
  items: AmiChartItemDto[]
}

export class AmiChartCreateDto extends OmitType(AmiChartDto, [
  "id",
  "createdAt",
  "updatedAt",
  "items",
] as const) {
  @Expose()
  @IsDefined()
  @Type(() => AmiChartItemCreateDto)
  @ValidateNested({ each: true })
  items: AmiChartItemCreateDto[]
}

export class AmiChartUpdateDto extends OmitType(AmiChartDto, [
  "id",
  "createdAt",
  "updatedAt",
  "items",
]) {
  @Expose()
  @IsOptional()
  @IsUUID()
  id?: string

  @Expose()
  @IsOptional()
  @IsDateString()
  createdAt?: Date

  @Expose()
  @IsOptional()
  @IsDateString()
  updatedAt?: Date

  @Expose()
  @IsDefined()
  @Type(() => AmiChartItemUpdateDto)
  @ValidateNested({ each: true })
  items: AmiChartItemUpdateDto[]
}
