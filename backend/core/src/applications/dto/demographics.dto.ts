import { OmitType } from "@nestjs/swagger"
import { Demographics } from "../entities/demographics.entity"
import { Expose } from "class-transformer"
import { IsOptional, IsUUID } from "class-validator"

export class DemographicsDto extends OmitType(Demographics, [] as const) {}

export class DemographicsCreateDto extends OmitType(DemographicsDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}

export class DemographicsUpdateDto extends OmitType(DemographicsDto, [
  "id",
  "createdAt",
  "updatedAt",
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
}
