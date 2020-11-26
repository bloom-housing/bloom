import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator"
import { Expose, Type } from "class-transformer"
import { AnyDict } from "../lib/unit_transformations"
import { Property } from "./property.entity"
import { AmiChart } from "./ami-chart.entity"

export class MinMax {
  @Expose()
  @IsDefined()
  @IsNumber()
  min: number

  @Expose()
  @IsDefined()
  @IsNumber()
  max: number
}

export class MinMaxCurrency {
  @Expose()
  @IsDefined()
  @IsString()
  min: string

  @Expose()
  @IsDefined()
  @IsString()
  max: string
}

export class UnitSummary {
  @Expose()
  @IsDefined()
  @IsString()
  unitType: string

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => MinMaxCurrency)
  minIncomeRange: MinMaxCurrency

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => MinMax)
  occupancyRange: MinMax

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => MinMax)
  rentAsPercentIncomeRange: MinMax

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => MinMaxCurrency)
  rentRange: MinMaxCurrency

  @Expose()
  @IsDefined()
  @IsString()
  totalAvailable: number

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => MinMax)
  areaRange: MinMax

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => MinMax)
  floorRange?: MinMax
}

export class UnitSummaryByReservedType {
  @Expose()
  @IsDefined()
  @IsString()
  reservedType: string

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => UnitSummary)
  byUnitType: UnitSummary[]
}

export class UnitSummaryByAMI {
  @Expose()
  @IsDefined()
  @IsString()
  percent: string

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => UnitSummary)
  byNonReservedUnitType: UnitSummary[]

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => UnitSummaryByReservedType)
  byReservedType: UnitSummaryByReservedType[]
}

export class HMI {
  columns: AnyDict
  rows: AnyDict[]
}

export class UnitsSummarized {
  @Expose()
  @IsDefined()
  @IsString({ each: true })
  unitTypes: string[]

  @Expose()
  @IsDefined()
  @IsString({ each: true })
  reservedTypes: string[]

  @Expose()
  @IsDefined()
  @IsString({ each: true })
  priorityTypes: string[]

  @Expose()
  @IsDefined()
  @IsString({ each: true })
  amiPercentages: string[]

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => UnitSummary)
  byUnitType: UnitSummary[]

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => UnitSummary)
  byNonReservedUnitType: UnitSummary[]

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => UnitSummaryByReservedType)
  byReservedType: UnitSummaryByReservedType[]

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => UnitSummaryByAMI)
  byAMI: UnitSummaryByAMI[]

  @Expose()
  hmi: HMI
}

@Entity({ name: "units" })
class Unit {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsUUID()
  @IsString()
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

  @ManyToOne(() => AmiChart, (amiChart) => amiChart.units, { eager: true, nullable: true })
  amiChart: AmiChart | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsString()
  amiPercentage?: string | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsNumberString()
  annualIncomeMin?: string | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsNumberString()
  monthlyIncomeMin?: string | null

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional()
  @IsNumber()
  floor?: number | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsString()
  annualIncomeMax?: string | null

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional()
  @IsNumber()
  maxOccupancy?: number | null

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional()
  @IsNumber()
  minOccupancy?: number | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsNumberString()
  monthlyRent?: string | null

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional()
  @IsNumber()
  numBathrooms?: number | null

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional()
  @IsNumber()
  numBedrooms?: number | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsString()
  number?: string | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsString()
  priorityType?: string | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsString()
  reservedType?: string | null

  @Column({ nullable: true, type: "numeric", precision: 8, scale: 2 })
  @Expose()
  @IsOptional()
  @IsString()
  sqFeet?: string | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsString()
  status?: string | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional()
  @IsString()
  unitType?: string | null

  @Column({ nullable: true, type: "numeric", precision: 8, scale: 2 })
  @Expose()
  @IsOptional()
  @IsString()
  monthlyRentAsPercentOfIncome?: string | null

  @ManyToOne(() => Property, (property) => property.units, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  property: Property

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional()
  @IsBoolean()
  bmrProgramChart?: boolean | null
}

export { Unit as default, Unit }
