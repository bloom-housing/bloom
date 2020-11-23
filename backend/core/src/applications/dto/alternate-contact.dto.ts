import { OmitType } from "@nestjs/swagger"
import { AlternateContact } from "../entities/alternate-contact.entity"
import { Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { AddressDto, AddressUpdateDto } from "../../shared/dto/address.dto"

export class AlternateContactDto extends OmitType(AlternateContact, ["mailingAddress"]) {
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => AddressDto)
  mailingAddress: AddressDto
}

export class AlternateContactUpdateDto extends OmitType(AlternateContact, [
  "id",
  "createdAt",
  "updatedAt",
  "mailingAddress",
]) {
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
  mailingAddress: AddressUpdateDto
}
