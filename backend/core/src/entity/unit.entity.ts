import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Listing } from "./listing.entity"

@Entity({ name: "units" })
class Unit {
  @PrimaryGeneratedColumn("uuid")
  id: string
  @Column({ nullable: true, type: "text" })
  amiPercentage: string
  @Column({ nullable: true, type: "text" })
  annualIncomeMin: string
  @Column({ nullable: true, type: "numeric", precision: 8, scale: 2 })
  monthlyIncomeMin: number
  @Column({ nullable: true, type: "numeric" })
  floor: number
  @Column({ nullable: true, type: "text" })
  annualIncomeMax: string
  @Column({ nullable: true, type: "numeric" })
  maxOccupancy: number
  @Column({ nullable: true, type: "numeric" })
  minOccupancy: number
  @Column({ nullable: true, type: "numeric", precision: 8, scale: 2 })
  monthlyRent: number
  @Column({ nullable: true, type: "numeric" })
  numBathrooms: number
  @Column({ nullable: true, type: "numeric" })
  numBedrooms: number
  @Column({ nullable: true, type: "text" })
  number: string
  @Column({ nullable: true, type: "text" })
  priorityType: string
  @Column({ nullable: true, type: "text" })
  reservedType: string
  @Column({ nullable: true, type: "numeric", precision: 8, scale: 2 })
  sqFeet: number
  @Column({ nullable: true, type: "text" })
  status: string
  @Column({ nullable: true, type: "text" })
  unitType: string
  @Column({ nullable: true, type: "date" })
  createdAt: Date
  @Column({ nullable: true, type: "date" })
  updatedAt: Date
  @Column({ nullable: true, type: "numeric" })
  amiChartId: number
  @Column({ nullable: true, type: "numeric", precision: 8, scale: 2 })
  monthlyRentAsPercentOfIncome: number
  @ManyToOne((type) => Listing, (listing) => listing.units, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  listing: Listing
}

export { Unit as default, Unit }
