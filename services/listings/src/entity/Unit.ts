import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Listing } from "./Listing"

@Entity()
export class Unit {
  @PrimaryGeneratedColumn("uuid")
  id: string
  @Column({ nullable: true })
  amiPercentage: string
  @Column({ nullable: true })
  annualIncomeMin: string
  @Column({ nullable: true })
  monthlyIncomeMin: number
  @Column({ nullable: true })
  floor: number
  @Column({ nullable: true })
  annualIncomeMax: string
  @Column({ nullable: true })
  maxOccupancy: number
  @Column({ nullable: true })
  minOccupancy: number
  @Column({ nullable: true })
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
  @Column({ nullable: true })
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
  listingId: number
  @Column({ nullable: true })
  amiChartId: number
  @Column({ nullable: true })
  monthlyRentAsPercentOfIncome: number
  @ManyToOne(
    type => Listing,
    listing => listing.units
  )
  listing: Listing
}
