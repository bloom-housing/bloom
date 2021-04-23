import { Expose } from "class-transformer"
import { IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"

export class AssetDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  label: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  fileId: string
}
