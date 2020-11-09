import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Expose } from "class-transformer"
import { IsDate, IsString, IsUUID } from "class-validator"
import { AmiChartItem } from "./ami-chart-item.entity"
import { Property } from "./property.entity"

@Entity()
export class AmiChart extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsString()
  @IsUUID()
  id: string

  @CreateDateColumn()
  @Expose()
  @IsDate()
  createdAt: Date

  @UpdateDateColumn()
  @Expose()
  @IsDate()
  updatedAt: Date

  @OneToMany(() => AmiChartItem, (amiChartItem) => amiChartItem.amiChart, {
    eager: true,
    cascade: true,
  })
  items: AmiChartItem[]

  @OneToMany(() => Property, (property) => property.amiChart)
  properties: Property[]

  @Column()
  @Expose()
  @IsString()
  name: string
}
