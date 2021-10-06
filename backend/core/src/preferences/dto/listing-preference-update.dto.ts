import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { IdDto } from "../../shared/dto/id.dto"
import { ListingPreferenceDto } from "./listing-preference.dto"

export class ListingPreferenceUpdateDto extends OmitType(ListingPreferenceDto, [
  "preference",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  preference: IdDto
}
