import { Expose } from "class-transformer"
import { IsString, IsUUID } from "class-validator"
import { OmitType } from "@nestjs/swagger"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ReservedCommunityType } from "../entities/reserved-community-type.entity"

export class ReservedCommunityTypeDto extends OmitType(ReservedCommunityType, [] as const) {}

export class ReservedCommunityTypeCreateDto extends OmitType(ReservedCommunityTypeDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}

export class ReservedCommunityTypeUpdateDto extends ReservedCommunityTypeCreateDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID()
  id: string
}
