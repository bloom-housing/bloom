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

@Entity()
export class AmiChartItem {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsString()
  @IsUUID()
  id: string

  @CreateDateColumn()
  @Expose()
  @IsDate()
  @Type(() => Date)
  createdAt: Date

  @UpdateDateColumn()
  @Expose()
  @IsDate()
  @Type(() => Date)
  updatedAt: Date

  @ManyToOne(() => AmiChart, (amiChart) => amiChart.items)
  amiChart: AmiChart

  @Column()
  @Expose()
  @IsNumber()
  percentOfAmi: number

  @Column()
  @Expose()
  @IsNumber()
  householdSize: number

  @Column()
  @Expose()
  @IsNumber()
  income: number
}
