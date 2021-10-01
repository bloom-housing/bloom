import { ListingPreference } from "../entities/listing-preference.entity"
import { OmitType } from "@nestjs/swagger"
import { IdDto } from "../../shared/dto/id.dto"
import { Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class ListingPreferenceDto extends OmitType(ListingPreference, [
  "listing",
  "preference",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  preference: IdDto
}
