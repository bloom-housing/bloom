import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsOptional } from "class-validator"
import { ListingDto } from "../../../src/listings/dto/listing.dto"
import { UserPreferences } from "../entities/user-preferences.entity"

export class UserPreferencesDto extends OmitType(UserPreferences, ["user", "favorites"] as const) {
  @Expose()
  @IsOptional()
  @Type(() => ListingDto)
  favorites?: ListingDto[] | null
}
