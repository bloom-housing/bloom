import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm"
import { Expose } from "class-transformer"
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { MonthlyRentDeterminationType } from "../types/monthly-rent-determination.enum"
import { AmiChart } from "../../ami-charts/entities/ami-chart.entity"
import { UnitGroup } from "./unit-group.entity"

@Entity({ name: "unit_group_ami_levels" })
export class UnitGroupAmiLevel {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  id: string

  @ManyToOne(() => AmiChart, { eager: false, nullable: true })
  amiChart?: AmiChart | null

  @RelationId(
    (unitsSummaryAmiLevelEntity: UnitGroupAmiLevel) => unitsSummaryAmiLevelEntity.amiChart
  )
  @Expose()
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  amiChartId?: string | null

  @ManyToOne(() => UnitGroup, (unitGroup: UnitGroup) => unitGroup.amiLevels)
  unitGroup: UnitGroup

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  amiPercentage: number | null

  @Column({ type: "enum", enum: MonthlyRentDeterminationType, nullable: false })
  @Expose()
  @IsEnum(MonthlyRentDeterminationType, { groups: [ValidationsGroupsEnum.default] })
  monthlyRentDeterminationType: MonthlyRentDeterminationType

  @Column({ nullable: true, type: "numeric", precision: 8, scale: 2 })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  flatRentValue?: number | null

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  percentageOfIncomeValue?: number | null
}
