import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { AmiChartItem } from "./ami-chart-item.entity"
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
