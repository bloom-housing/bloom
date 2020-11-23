import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { Exclude, Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, ValidateNested } from "class-validator"
import { Property } from "../entity/property.entity"
import { UnitDto } from "../units/unit.dto"
import { AmiChartDto } from "../ami-charts/ami-chart.dto"
import { AmiChart } from "../entity/ami-chart.entity"
import { AddressDto, AddressUpdateDto } from "../shared/dto/address.dto"

export class PropertyDto extends OmitType(Property, [
  "listings",
  "units",
  "propertyGroups",
  "amiChart",
  "buildingAddress",
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

  @IsDefined()
  @ValidateNested()
  buildingAddress: AddressDto
}

export class PropertyCreateDto extends OmitType(PropertyDto, [
  "id",
  "createdAt",
  "updatedAt",
  "unitsSummarized",
  "buildingAddress",
] as const) {
  @Exclude()
  @ApiHideProperty()
  unitsSummarized

  @Expose()
  @IsDefined()
  @ValidateNested()
  buildingAddress: AddressUpdateDto
}

export class PropertyUpdateDto extends OmitType(PropertyDto, ["unitsSummarized"]) {
  @Exclude()
  @ApiHideProperty()
  unitsSummarized
}
