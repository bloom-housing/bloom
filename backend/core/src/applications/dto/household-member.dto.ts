import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { Exclude, Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { AddressDto, AddressUpdateDto } from "../../shared/dto/address.dto"
import { HouseholdMember } from "../entities/household-member.entity"

export class HouseholdMemberDto extends OmitType(HouseholdMember, [
  "address",
  "workAddress",
  "application",
] as const) {
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => AddressDto)
  workAddress: AddressDto

  @Exclude()
  @ApiHideProperty()
  application
}

export class HouseholdMemberUpdateDto extends OmitType(HouseholdMember, [
  "id",
  "createdAt",
  "updatedAt",
  "address",
  "workAddress",
  "application",
] as const) {
  @Expose()
  @IsOptional()
  @IsUUID()
  id?: string

  @Expose()
  @IsOptional()
  @IsUUID()
  createdAt?: Date

  @Expose()
  @IsOptional()
  @IsUUID()
  updatedAt?: Date

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => AddressUpdateDto)
  address: AddressUpdateDto

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => AddressUpdateDto)
  workAddress: AddressUpdateDto

  @Exclude()
  @ApiHideProperty()
  application
}
