import { Expose } from "class-transformer"
import { IsString, IsUUID } from "class-validator"
import { OmitType } from "@nestjs/swagger"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UnitRentType } from "../entities/unit-rent-type.entity"

export class UnitRentTypeDto extends OmitType(UnitRentType, [] as const) {}

export class UnitRentTypeCreateDto extends OmitType(UnitRentTypeDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}

export class UnitRentTypeUpdateDto extends UnitRentTypeCreateDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID()
  id: string
}
