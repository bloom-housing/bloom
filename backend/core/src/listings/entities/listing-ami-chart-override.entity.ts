import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Column, Entity, ManyToOne } from "typeorm"
import { Expose, Type } from "class-transformer"
import { Unit } from "../../units/entities/unit.entity"
import { IsDefined, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { AmiChartItem } from "../../ami-charts/entities/ami-chart-item.entity"
import { Listing } from "./listing.entity"

@Entity({ name: "listing_ami_chart_overrides" })
export class ListingAmiChartOverride extends AbstractEntity {
  @ManyToOne(() => Unit)
  @Expose()
  unit: Unit

  @Column("jsonb")
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AmiChartItem)
  items: AmiChartItem[]

  @ManyToOne(() => Listing, (listing) => listing.amiChartOverrides)
  @Expose()
  listing: Listing
}
