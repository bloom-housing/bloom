import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Column, Entity } from "typeorm"
import { Expose, Type } from "class-transformer"
import { IsDefined, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { AmiChartItem } from "../../ami-charts/entities/ami-chart-item.entity"

@Entity({ name: "unit_ami_chart_overrides" })
export class UnitAmiChartOverride extends AbstractEntity {
  @Column("jsonb")
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AmiChartItem)
  items: AmiChartItem[]
}
