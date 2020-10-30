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
  IsBoolean,
  IsDate,
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
  @IsDate()
  createdAt: Date

  @UpdateDateColumn()
  @Expose()
  @IsDate()
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

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional()
  @IsNumber()
  floor: number | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsString()
  annualIncomeMax: string | null

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional()
  @IsNumber()
  maxOccupancy: number | null

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional()
  @IsNumber()
  minOccupancy: number | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsNumberString()
  monthlyRent: string | null

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional()
  @IsNumber()
  numBathrooms: number | null

  @Column({ nullable: true, type: "integer" })
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
  @IsString()
  sqFeet: string | null

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

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional()
  @IsNumber()
  amiChartId: number | null

  @Column({ nullable: true, type: "numeric", precision: 8, scale: 2 })
  @Expose()
  @IsOptional()
  @IsString()
  monthlyRentAsPercentOfIncome: string | null

  @ManyToOne((type) => Listing, (listing) => listing.units, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  listing: Listing

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional()
  @IsBoolean()
  bmrProgramChart?: boolean | null
}

export { Unit as default, Unit }
