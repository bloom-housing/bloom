import { Expose } from "class-transformer"
import { IsNumber } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class AmiChartItem {
  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  percentOfAmi: number

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  householdSize: number

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  income: number
}
