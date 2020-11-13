import { OmitType } from "@nestjs/swagger"
import { AlternateContact } from "../entities/alternate-contact.entity"
import { Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { AddressUpdateDto } from "../../shared/dto/address.dto"

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
