import { OmitType } from "@nestjs/swagger"
import { AlternateContact } from "../entities/alternate-contact.entity"
import { Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { AddressCreateDto, AddressDto, AddressUpdateDto } from "../../shared/dto/address.dto"

export class AlternateContactDto extends OmitType(AlternateContact, ["mailingAddress"]) {
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => AddressDto)
  mailingAddress: AddressDto
}

export class AlternateContactCreateDto extends OmitType(AlternateContactDto, [
  "id",
  "createdAt",
  "updatedAt",
  "mailingAddress",
]) {
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => AddressCreateDto)
  mailingAddress: AddressCreateDto
}

export class AlternateContactUpdateDto extends OmitType(AlternateContactDto, [
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
