import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Expose, Type } from "class-transformer"
import { IsDate, IsNumber, IsString, IsUUID } from "class-validator"
import { AmiChart } from "./ami-chart.entity"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"

@Entity()
export class AmiChartItem {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id: string

  @CreateDateColumn()
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  createdAt: Date

  @UpdateDateColumn()
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  updatedAt: Date

  @ManyToOne(() => AmiChart, (amiChart) => amiChart.items)
  amiChart: AmiChart

  @Column()
  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  percentOfAmi: number

  @Column()
  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  householdSize: number

  @Column()
  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  income: number
}
