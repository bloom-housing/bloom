import { Expose } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsOptional, IsUUID } from "class-validator"
import { ListingsQueryParams } from "./listings-query-params"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

// These are the parameters for /listings/getExternal. ListingsQueryParams are
// extracted from these query params and passed through to each jurisdiction.
// Ideally these params would contain an instance of listingQueryParams, but
// becuase NestJS has hard time validating very nested query param decorators,
// we extend ListingsQueryParams and will delete the bloomJurisdiction param
// before passing onto /listings.
export class DoorwayListingsExternalQueryParams extends ListingsQueryParams {
  @Expose()
  @ApiProperty({
    name: "bloomJurisdiction",
    type: [String],
    example: "3328e8df-e064-4d9c-99cc-467ba43dd2de",
    required: false,
    isArray: true,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default], each: true })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  bloomJurisdiction?: string[]
}
