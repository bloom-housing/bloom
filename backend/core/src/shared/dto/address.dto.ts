import { Expose } from "class-transformer"
import { IsOptional, IsUUID } from "class-validator"
import { OmitType } from "@nestjs/swagger"
import { Address } from "../entities/address.entity"

export class AddressDto extends OmitType(Address, []) {}
export class AddressCreateDto extends OmitType(Address, ["id", "createdAt", "updatedAt"]) {}

export class AddressUpdateDto extends OmitType(Address, ["id", "createdAt", "updatedAt"]) {
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
}
