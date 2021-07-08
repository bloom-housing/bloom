import { Expose } from "class-transformer"
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ApiProperty } from "@nestjs/swagger"
import { ApplicationMethodType } from "../types/application-method-type-enum"

export class ApplicationMethodDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ApplicationMethodType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: ApplicationMethodType, enumName: "ApplicationMethodType" })
  type: ApplicationMethodType

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  label?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  externalReference?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  acceptsPostmarkedApplications?: boolean | null
}
