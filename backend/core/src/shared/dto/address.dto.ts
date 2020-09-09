import { Expose } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class Address {
  @Expose()
  @IsOptional()
  @IsString()
  placeName?: string
  @Expose()
  @IsString()
  city: string
  @Expose()
  @IsOptional()
  @IsString()
  county?: string
  @Expose()
  @IsString()
  state: string
  @Expose()
  @IsString()
  street: string
  @Expose()
  @IsOptional()
  @IsString()
  street2?: string
  @Expose()
  @IsString()
  zipCode: string
  @Expose()
  @IsOptional()
  @IsNumber()
  latitude?: number
  @Expose()
  @IsOptional()
  @IsNumber()
  longitude?: number
}
