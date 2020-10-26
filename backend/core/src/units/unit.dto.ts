import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { Unit } from "../entity/unit.entity"
import { Exclude, Expose } from "class-transformer"
import { IsString, IsUUID } from "class-validator"

export class UnitDto extends OmitType(Unit, ["listing"] as const) {
  @Exclude()
  @ApiHideProperty()
  listing
}

export class UnitCreateDto extends OmitType(UnitDto, ["id", "createdAt", "updatedAt"] as const) {}

export class UnitUpdateDto extends UnitCreateDto {
  @Expose()
  @IsString()
  @IsUUID()
  id: string
}
