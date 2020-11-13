import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { Exclude, Expose, Type } from "class-transformer"
import { IsDefined, IsString, IsUUID, ValidateNested } from "class-validator"
import { Property } from "../entity/property.entity"
import { UnitDto } from "../units/unit.dto"
import { AddressUpdateDto } from "../shared/dto/address.dto"

export class PropertyDto extends OmitType(Property, [
  "listings",
  "units",
  "propertyGroups",
  "buildingAddress"
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
  @IsDefined()
  @ValidateNested()
  buildingAddress: AddressUpdateDto
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

export class PropertyUpdateDto extends PropertyCreateDto {
  @Expose()
  @IsString()
  @IsUUID()
  id: string
}
