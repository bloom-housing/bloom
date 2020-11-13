import { Expose } from "class-transformer"
import { IsOptional, IsString } from "class-validator"

export class HousingCounselor {
  @Expose()
  @IsString()
  name: string

  @Expose()
  @IsString({ each: true })
  languages: string[]

  @Expose()
  @IsOptional()
  @IsString()
  address: string | null

  @Expose()
  @IsOptional()
  @IsString()
  citystate: string | null

  @Expose()
  @IsOptional()
  @IsString()
  phone: string | null

  @Expose()
  @IsOptional()
  @IsString()
  website: string | null
}
