import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { Exclude, Expose, Type } from "class-transformer"
import { IsDefined, ValidateNested } from "class-validator"
import { Property } from "../entity/property.entity"
import { AddressDto, AddressUpdateDto } from "../shared/dto/address.dto"
import { UnitDto, UnitUpdateDto } from "../units/unit.dto"

export class PropertyDto extends OmitType(Property, [
  "listings",
  "units",
  "propertyGroups",
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

  @ValidateNested()
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => AddressDto)
  buildingAddress: AddressDto
}

export class PropertyCreateDto extends OmitType(PropertyDto, [
  "id",
  "createdAt",
  "updatedAt",
  "unitsSummarized",
  "buildingAddress",
  "units",
] as const) {
  @Exclude()
  @ApiHideProperty()
  unitsSummarized

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => AddressUpdateDto)
  buildingAddress: AddressUpdateDto

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => UnitUpdateDto)
  units: UnitUpdateDto[]
}

export class PropertyUpdateDto extends OmitType(PropertyDto, ["unitsSummarized"]) {
  @Exclude()
  @ApiHideProperty()
  unitsSummarized
}
