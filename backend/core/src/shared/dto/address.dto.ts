import { Expose, Type } from "class-transformer"
import { IsDate, IsString, IsOptional, IsUUID, MaxLength } from "class-validator"
import { OmitType } from "@nestjs/swagger"
import { Address } from "../entities/address.entity"
import { ValidationsGroupsEnum } from "../types/validations-groups-enum"

export class AddressDto extends OmitType(Address, []) {}

export class AddressCountyRequiredCreateDto extends OmitType(Address, [
  "county",
  "id",
  "createdAt",
  "updatedAt",
]) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  county?: string
}

export class AddressCreateDto extends OmitType(Address, ["id", "createdAt", "updatedAt"]) {}

export class AddressUpdateDto extends OmitType(Address, ["id", "createdAt", "updatedAt"]) {
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

export class AddressCountyRequiredUpdateDto extends OmitType(Address, [
  "county",
  "id",
  "createdAt",
  "updatedAt",
]) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  county?: string

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
