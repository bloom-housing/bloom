import { ListingFilterParams } from "../dto/listing-filter-params"
import { CombinedListingFilterKeys } from "./combined-listing-filter-keys-enum"
import { Expose, Transform } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsBoolean } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class CombinedListingFilterParams extends ListingFilterParams {
  @Expose()
  @ApiProperty({
    type: Boolean,
    example: false,
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @Transform((value: string | undefined) => {
    switch (value) {
      case "true":
        return true
      case "false":
        return false
      default:
        return undefined
    }
  })
  [CombinedListingFilterKeys.isExternal]?: boolean
}
