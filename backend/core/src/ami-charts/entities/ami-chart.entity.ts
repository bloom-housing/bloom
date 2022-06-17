import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Expose, Type } from "class-transformer"
import { IsDate, IsDefined, IsString, IsUUID, ValidateNested } from "class-validator"
import { AmiChartItem } from "./ami-chart-item.entity"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { Jurisdiction } from "../../jurisdictions/entities/jurisdiction.entity"

@Entity()
export class AmiChart {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column("jsonb")
  items: AmiChartItem[]

  @Column()
  name: string

  @ManyToOne(() => Jurisdiction, { eager: true, nullable: false })
  jurisdiction: Jurisdiction
}
