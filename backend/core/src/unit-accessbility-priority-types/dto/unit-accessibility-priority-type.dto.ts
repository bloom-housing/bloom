import { Expose } from "class-transformer"
import { IsString, IsUUID } from "class-validator"
import { OmitType } from "@nestjs/swagger"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UnitAccessibilityPriorityType } from "../entities/unit-accessibility-priority-type.entity"

export class UnitAccessibilityPriorityTypeDto extends OmitType(
  UnitAccessibilityPriorityType,
  [] as const
) {}

export class UnitAccessibilityPriorityTypeCreateDto extends OmitType(
  UnitAccessibilityPriorityTypeDto,
  ["id", "createdAt", "updatedAt"] as const
) {}

export class UnitAccessibilityPriorityTypeUpdateDto extends UnitAccessibilityPriorityTypeCreateDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID()
  id: string
}
