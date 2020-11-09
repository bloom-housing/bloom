import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { Exclude, Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, ValidateNested } from "class-validator"
import { Property } from "../entity/property.entity"
import { UnitDto } from "../units/unit.dto"
import { AmiChartDto } from "../ami-charts/ami-chart.dto"
import { AmiChart } from "../entity/ami-chart.entity"

export class PropertyDto extends OmitType(Property, [
  "listings",
  "units",
  "propertyGroups",
  "amiChart",
] as const) {
  @Exclude()
  @ApiHideProperty()
  listings

  @Exclude()
  @ApiHideProperty()
  propertyGroups

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => UnitDto)
  units: UnitDto[]

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => AmiChart)
  amiChart: AmiChartDto | null
}

export class PropertyCreateDto extends OmitType(PropertyDto, [
  "id",
  "createdAt",
  "updatedAt",
  "unitsSummarized",
] as const) {
  @Exclude()
  @ApiHideProperty()
  unitsSummarized
}

export class PropertyUpdateDto extends OmitType(PropertyDto, ["unitsSummarized"]) {
  @Exclude()
  @ApiHideProperty()
  unitsSummarized
}
