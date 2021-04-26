import { Expose } from "class-transformer"
import { IsDefined, IsNumber } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class MinMax {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  min: number

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  max: number
}
