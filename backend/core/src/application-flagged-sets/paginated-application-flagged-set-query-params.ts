import { PaginationQueryParams } from "../shared/dto/pagination.dto"
import { Expose } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsOptional, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../shared/types/validations-groups-enum"
import { View } from "./types/view-enum"

export class PaginatedApplicationFlaggedSetQueryParams extends PaginationQueryParams {
  @Expose()
  @ApiProperty({
    type: String,
    example: "listingId",
    required: true,
  })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  listingId: string

  @Expose()
  @ApiProperty({
    enum: Object.keys(View),
    example: "active",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(View, { groups: [ValidationsGroupsEnum.default] })
  view?: View
}
