import { Expose } from "class-transformer"
import { IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"

export class Asset {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  label: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  fileId: string
}
