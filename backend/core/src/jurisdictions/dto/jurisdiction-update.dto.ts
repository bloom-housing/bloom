import { OmitType } from "@nestjs/swagger"
import { Expose } from "class-transformer"
import { IsOptional, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { JurisdictionDto } from "./jurisdiction.dto"

export class JurisdictionUpdateDto extends OmitType(JurisdictionDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id?: string
}
