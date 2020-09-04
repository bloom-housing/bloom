import { ApplicationMethodType } from "../entity/applicationMethod.entity"
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from "class-validator"
import { Expose } from "class-transformer"

export class ApplicationMethodDto {
  @Expose()
  @IsString()
  @IsUUID()
  id: string

  @Expose()
  @IsEnum(ApplicationMethodType)
  type: ApplicationMethodType

  @Expose()
  @IsOptional()
  @IsString()
  label?: string

  @Expose()
  @IsOptional()
  @IsString()
  externalReference?: string

  @Expose()
  @IsOptional()
  @IsBoolean()
  acceptsPostmarkedApplications?: boolean
}
