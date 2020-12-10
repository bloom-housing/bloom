import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { Exclude, Expose, Type } from "class-transformer"
import { IsDate, IsDefined, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { Property } from "../entity/property.entity"
import { AddressDto, AddressUpdateDto } from "../shared/dto/address.dto"
import { UnitCreateDto, UnitDto, UnitUpdateDto } from "../units/unit.dto"

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
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => AddressUpdateDto)
  buildingAddress: AddressUpdateDto

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => UnitCreateDto)
  units: UnitCreateDto[]
}

export class PropertyUpdateDto extends OmitType(PropertyDto, [
  "id",
  "createdAt",
  "updatedAt",
  "unitsSummarized",
  "buildingAddress",
  "units",
] as const) {
  @Expose()
  @IsOptional()
  @IsUUID()
  id?: string

  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date

  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date

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
