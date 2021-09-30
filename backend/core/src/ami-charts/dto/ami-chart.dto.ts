import { Expose, Type } from "class-transformer"
import { IsDate, IsDefined, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { OmitType } from "@nestjs/swagger"
import { AmiChart } from "../entities/ami-chart.entity"
import { AmiChartItem } from "../entities/ami-chart-item.entity"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { JurisdictionDto } from "../../jurisdictions/dto/jurisdiction.dto"
import { IdDto } from "../../shared/dto/id.dto"

export class AmiChartDto extends OmitType(AmiChart, ["items", "jurisdiction"] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AmiChartItem)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  items: AmiChartItem[]

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => JurisdictionDto)
  jurisdiction: JurisdictionDto
}

export class AmiChartCreateDto extends OmitType(AmiChartDto, [
  "id",
  "createdAt",
  "updatedAt",
  "items",
  "jurisdiction",
] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AmiChartItem)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  items: AmiChartItem[]

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  jurisdiction: IdDto
}

export class AmiChartUpdateDto extends OmitType(AmiChartDto, [
  "id",
  "createdAt",
  "updatedAt",
  "items",
  "jurisdiction",
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
  @Type(() => AmiChartItem)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  items: AmiChartItem[]

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  jurisdiction: IdDto
}
