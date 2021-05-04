import { Expose, Type } from "class-transformer"
import { IsDefined, IsString, IsUUID, ValidateNested } from "class-validator"
import { IdDto } from "../../shared/dto/id.dto"
import { PropertyGroup } from "../entities/property-group.entity"
import { OmitType } from "@nestjs/swagger"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class PropertyGroupDto extends OmitType(PropertyGroup, ["properties"] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  properties: IdDto[]
}

export class PropertyGroupCreateDto extends OmitType(PropertyGroupDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}

export class PropertyGroupUpdateDto extends PropertyGroupCreateDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID()
  id: string
}
