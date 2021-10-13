import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { Unit } from "../entities/unit.entity"
import { Exclude, Expose, plainToClass, Transform, Type } from "class-transformer"
import { IsDefined, IsOptional, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { IdDto } from "../../shared/dto/id.dto"
import { UnitTypeDto } from "../../unit-types/dto/unit-type.dto"
import { UnitRentTypeDto } from "../../unit-rent-types/dto/unit-rent-type.dto"
import { UnitAccessibilityPriorityTypeDto } from "../../unit-accessbility-priority-types/dto/unit-accessibility-priority-type.dto"
import { UnitAmiChartOverrideDto } from "./unit-ami-chart-override.dto"

export class UnitDto extends OmitType(Unit, [
  "property",
  "amiChart",
  "amiChartId",
  "unitType",
  "unitRentType",
  "priorityType",
  "amiChartOverride",
] as const) {
  @Exclude()
  @ApiHideProperty()
  property

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  @Transform(
    (value, obj) => {
      return obj.amiChartId ? plainToClass(IdDto, { id: obj.amiChartId }) : undefined
    },
    { toClassOnly: true }
  )
  amiChart?: IdDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitTypeDto)
  unitType?: UnitTypeDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitRentTypeDto)
  unitRentType?: UnitRentTypeDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitAccessibilityPriorityTypeDto)
  priorityType?: UnitAccessibilityPriorityTypeDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitAmiChartOverrideDto)
  amiChartOverride?: UnitAmiChartOverrideDto
}
