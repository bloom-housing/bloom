import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Expose, Type } from "class-transformer"
import { IsDate, IsDefined, IsString, IsUUID, ValidateNested } from "class-validator"
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
  @Type(() => Date)
  createdAt: Date

  @UpdateDateColumn()
  @Expose()
  @IsDate()
  @Type(() => Date)
  updatedAt: Date

  @OneToMany(() => AmiChartItem, (amiChartItem) => amiChartItem.amiChart, {
    eager: true,
    cascade: true,
  })
  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => AmiChartItem)
  items: AmiChartItem[]

  @OneToMany(() => Property, (property) => property.amiChart)
  properties: Property[]

  @Column()
  @Expose()
  @IsString()
  name: string
}
