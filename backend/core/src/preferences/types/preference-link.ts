import { Expose } from "class-transformer"
import { IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class PreferenceLink {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  title: string
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  url: string
}
