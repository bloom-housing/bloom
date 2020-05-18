import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Listing } from "./Listing"

@Entity()
export class Unit {
  @PrimaryGeneratedColumn("uuid")
  id: string
  @Column({ type: "string", nullable: true })
  amiPercentage: string
  @Column({ type: "string", nullable: true })
  annualIncomeMin: string
  @Column({ nullable: true, type: "numeric", precision: 8, scale: 2 })
  monthlyIncomeMin: number
  @Column({ type: "number", nullable: true })
  floor: number
  @Column({ type: "string", nullable: true })
  annualIncomeMax: string
  @Column({ type: "number", nullable: true })
  maxOccupancy: number
  @Column({ type: "number", nullable: true })
  minOccupancy: number
  @Column({ nullable: true, type: "numeric", precision: 8, scale: 2 })
  monthlyRent: number
  @Column({ type: "number", nullable: true })
  numBathrooms: number
  @Column({ type: "number", nullable: true })
  numBedrooms: number
  @Column({ type: "string", nullable: true })
  number: string
  @Column({ type: "number", nullable: true })
  priorityType: string
  @Column({ type: "number", nullable: true })
  reservedType: string
  @Column({ nullable: true, type: "numeric", precision: 8, scale: 2 })
  sqFeet: number
  @Column({ type: "number", nullable: true })
  status: string
  @Column({ type: "number", nullable: true })
  unitType: string
  @Column({ type: "date", nullable: true })
  createdAt: Date
  @Column({ type: "date", nullable: true })
  updatedAt: Date
  @Column({ type: "number", nullable: true })
  amiChartId: number
  @Column({ nullable: true, type: "numeric", precision: 8, scale: 2 })
  monthlyRentAsPercentOfIncome: number
  @ManyToOne(
    type => Listing,
    listing => listing.units
  )
  listing: Listing
}
