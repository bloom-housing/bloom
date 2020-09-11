import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm"
import { Listing } from "./listing.entity"
import {
  IsDateString,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator"
import { Expose } from "class-transformer"

@Entity({ name: "units" })
class Unit extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsUUID()
  @IsString()
  id: string

  @CreateDateColumn()
  @Expose()
  @IsDateString()
  createdAt: Date

  @UpdateDateColumn()
  @Expose()
  @IsDateString()
  updatedAt: Date

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsString()
  amiPercentage: string | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsNumberString()
  annualIncomeMin: string | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsNumberString()
  monthlyIncomeMin: string | null

  @Column({ nullable: true, type: "numeric" })
  @Expose()
  @IsOptional()
  @IsNumber()
  floor: number | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsString()
  annualIncomeMax: string | null

  @Column({ nullable: true, type: "numeric" })
  @Expose()
  @IsOptional()
  @IsNumber()
  maxOccupancy: number | null

  @Column({ nullable: true, type: "numeric" })
  @Expose()
  @IsOptional()
  @IsNumber()
  minOccupancy: number | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsNumberString()
  monthlyRent: string | null

  @Column({ nullable: true, type: "numeric" })
  @Expose()
  @IsOptional()
  @IsNumber()
  numBathrooms: number | null

  @Column({ nullable: true, type: "numeric" })
  @Expose()
  @IsOptional()
  @IsNumber()
  numBedrooms: number | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsString()
  number: string | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsString()
  priorityType: string | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsString()
  reservedType: string | null

  @Column({ nullable: true, type: "numeric", precision: 8, scale: 2 })
  @Expose()
  @IsOptional()
  @IsNumber()
  sqFeet: number | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsString()
  status: string | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsString()
  unitType: string | null

  @Column({ nullable: true, type: "numeric" })
  @Expose()
  @IsOptional()
  @IsNumber()
  amiChartId: number | null

  @Column({ nullable: true, type: "numeric", precision: 8, scale: 2 })
  @Expose()
  @IsOptional()
  @IsNumber()
  monthlyRentAsPercentOfIncome: number | null

  @ManyToOne((type) => Listing, (listing) => listing.units, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  listing: Listing
}

export { Unit as default, Unit }
