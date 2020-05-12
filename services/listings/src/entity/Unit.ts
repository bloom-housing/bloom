import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { ListingModel } from "./Listing"
import { Unit } from "@bloom-housing/core"

@Entity()
export class UnitModel implements Unit {
  @PrimaryGeneratedColumn("uuid")
  id: string
  @Column({ nullable: true })
  amiPercentage: string
  @Column({ nullable: true })
  annualIncomeMin: string
  @Column({ nullable: true, type: "numeric", precision: 8, scale: 2 })
  monthlyIncomeMin: number
  @Column({ nullable: true })
  floor: number
  @Column({ nullable: true })
  annualIncomeMax: string
  @Column({ nullable: true })
  maxOccupancy: number
  @Column({ nullable: true })
  minOccupancy: number
  @Column({ nullable: true, type: "numeric", precision: 8, scale: 2 })
  monthlyRent: number
  @Column({ nullable: true })
  numBathrooms: number
  @Column({ nullable: true })
  numBedrooms: number
  @Column({ nullable: true })
  number: string
  @Column({ nullable: true })
  priorityType: string
  @Column({ nullable: true })
  reservedType: string
  @Column({ nullable: true, type: "numeric", precision: 8, scale: 2 })
  sqFeet: number
  @Column({ nullable: true })
  status: string
  @Column({ nullable: true })
  unitType: string
  @Column({ nullable: true })
  createdAt: Date
  @Column({ nullable: true })
  updatedAt: Date
  @Column({ nullable: true })
  amiChartId: number
  @Column({ nullable: true, type: "numeric", precision: 8, scale: 2 })
  monthlyRentAsPercentOfIncome: number
  @ManyToOne((type) => ListingModel, (listing) => listing.units)
  listing: ListingModel

  listingId: number
}
