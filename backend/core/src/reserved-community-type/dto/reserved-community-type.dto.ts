import { Expose, Type } from "class-transformer"
import { IsDefined, IsString, IsUUID, ValidateNested } from "class-validator"
import { OmitType } from "@nestjs/swagger"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ReservedCommunityType } from "../entities/reserved-community-type.entity"
import { IdDto } from "../../shared/dto/id.dto"
import { JurisdictionDto } from "../../jurisdictions/dto/jurisdiction.dto"

export class ReservedCommunityTypeDto extends OmitType(ReservedCommunityType, [
  "jurisdiction",
] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => JurisdictionDto)
  jurisdiction: JurisdictionDto
}

export class ReservedCommunityTypeCreateDto extends OmitType(ReservedCommunityTypeDto, [
  "id",
  "createdAt",
  "updatedAt",
  "jurisdiction",
] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  jurisdiction: IdDto
}

export class ReservedCommunityTypeUpdateDto extends ReservedCommunityTypeCreateDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID()
  id: string
}
