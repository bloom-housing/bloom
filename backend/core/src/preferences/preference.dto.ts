import { Expose, Type } from "class-transformer"
import { IsOptional, IsString, IsUUID, ValidateNested } from "class-validator"
import { PreferenceLink } from "../shared/dto/preferenceLink.dto"

export class PreferenceDto {
  @Expose()
  @IsUUID()
  id: string
  @Expose()
  @IsString()
  ordinal: string
  @Expose()
  @IsString()
  title: string
  @Expose()
  @IsOptional()
  @IsString()
  subtitle?: string
  @Expose()
  @IsOptional()
  @IsString()
  description?: string
  @Expose()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type((type) => PreferenceLink)
  links?: PreferenceLink[]
}
