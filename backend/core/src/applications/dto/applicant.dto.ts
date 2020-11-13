import { OmitType } from "@nestjs/swagger"
import { Applicant } from "../entities/applicant.entity"
import { Expose } from "class-transformer"
import { IsDefined, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { AddressUpdateDto } from "../../shared/dto/address.dto"

export class ApplicantUpdateDto extends OmitType(Applicant, [
  "id",
  "createdAt",
  "updatedAt",
  "address",
  "workAddress"
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
  address: AddressUpdateDto

  @Expose()
  @IsDefined()
  @ValidateNested()
  workAddress: AddressUpdateDto
}
