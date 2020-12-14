import { Expose } from "class-transformer"
import { IsOptional, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"

export class HousingCounselor {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  name: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  languages: string[]

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  address: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  citystate: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  phone: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  website: string | null
}
