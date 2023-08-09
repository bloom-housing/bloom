import { Expose } from "class-transformer"
import { IsOptional, IsString, MaxLength } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class RequestApprovalDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  listingId?: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  appUrl?: string | null
}
