import { Expose } from "class-transformer"
import { IsDateString, IsNumber, IsString, IsUUID } from "class-validator"

export class UnitDto {
  @Expose()
  @IsString()
  @IsUUID()
  id: string
  @Expose()
  @IsString()
  amiPercentage: string
  @Expose()
  @IsString()
  annualIncomeMin: string
  @Expose()
  @IsNumber()
  monthlyIncomeMin: number
  @Expose()
  @IsNumber()
  floor: number
  @Expose()
  @IsString()
  annualIncomeMax: string
  @Expose()
  @IsNumber()
  maxOccupancy: number
  @Expose()
  @IsNumber()
  minOccupancy: number
  @Expose()
  @IsNumber()
  monthlyRent: number
  @Expose()
  @IsNumber()
  numBathrooms: number
  @Expose()
  @IsNumber()
  numBedrooms: number
  @Expose()
  @IsString()
  number: string
  @Expose()
  @IsString()
  priorityType: string
  @Expose()
  @IsString()
  reservedType: string
  @Expose()
  @IsNumber()
  sqFeet: number
  @Expose()
  @IsString()
  status: string
  @Expose()
  @IsString()
  unitType: string
  @Expose()
  @IsDateString()
  createdAt: Date
  @IsDateString()
  updatedAt: Date
  @Expose()
  @IsNumber()
  amiChartId: number
  @Expose()
  @IsNumber()
  monthlyRentAsPercentOfIncome: number
}

