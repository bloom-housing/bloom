import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { ApplicationMethod } from "../entity/application-method.entity"
import { Exclude, Expose, Type } from "class-transformer"
import { IsDate, IsOptional, IsUUID } from "class-validator"

export class ApplicationMethodDto extends OmitType(ApplicationMethod, ["listing"] as const) {
  @Exclude()
  @ApiHideProperty()
  listing
}

export class ApplicationMethodCreateDto extends OmitType(ApplicationMethodDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}

export class ApplicationMethodUpdateDto extends OmitType(ApplicationMethodDto, [
  "id",
  "createdAt",
  "updatedAt",
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
}
