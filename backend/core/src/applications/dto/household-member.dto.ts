import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { Exclude, Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { AddressUpdateDto } from "../../shared/dto/address.dto"
import { HouseholdMember } from "../entities/household-member.entity"

export class HouseholdMemberUpdateDto extends OmitType(HouseholdMember, [
  "id",
  "createdAt",
  "updatedAt",
  "address",
  "workAddress",
  "applicationData"
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
  applicationData
}
