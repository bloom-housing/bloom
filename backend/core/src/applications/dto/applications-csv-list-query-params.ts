import { PaginatedApplicationListQueryParams } from "./paginated-application-list-query-params"
import { Expose, Transform } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsOptional } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class ApplicationsCsvListQueryParams extends PaginatedApplicationListQueryParams {
  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @Transform((value: string | undefined) => value === "true", { toClassOnly: true })
  includeDemographics?: boolean
}
