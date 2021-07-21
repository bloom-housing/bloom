import { Expose } from "class-transformer"
import { IsString, IsUUID } from "class-validator"
import { OmitType } from "@nestjs/swagger"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UnitType } from "../entities/unit-type.entity"

export class UnitTypeDto extends OmitType(UnitType, [] as const) {}

export class UnitTypeCreateDto extends OmitType(UnitTypeDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}

export class UnitTypeUpdateDto extends UnitTypeCreateDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID()
  id: string
}
