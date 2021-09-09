import { PaginationQueryParams } from "../shared/dto/pagination.dto"
import { Expose } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../shared/types/validations-groups-enum"

export class PaginatedApplicationFlaggedSetQueryParams extends PaginationQueryParams {
  @Expose()
  @ApiProperty({
    type: String,
    example: "listingId",
    required: true,
  })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  listingId: string
}
