import { Expose } from "class-transformer"
import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class EmailDto {
  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  email: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  appUrl?: string | null
}
