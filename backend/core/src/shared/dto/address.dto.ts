import { Expose } from "class-transformer"
import { IsDefined, IsNumber, IsOptional, IsString } from "class-validator"

export class Address {
  @Expose()
  @IsOptional()
  @IsString()
  placeName?: string

  @Expose()
  @IsDefined()
  @IsString()
  city: string

  @Expose()
  @IsOptional()
  @IsString()
  county?: string

  @Expose()
  @IsDefined()
  @IsString()
  state: string

  @Expose()
  @IsDefined()
  @IsString()
  street: string

  @Expose()
  @IsOptional()
  @IsString()
  street2?: string

  @Expose()
  @IsDefined()
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
