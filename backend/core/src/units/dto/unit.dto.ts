import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { Unit } from "../entities/unit.entity"
import { Exclude, Expose, plainToClass, Transform, Type } from "class-transformer"
import { IsDate, IsDefined, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { IdDto } from "../../shared/dto/id.dto"
import {
  UnitTypeCreateDto,
  UnitTypeDto,
  UnitTypeUpdateDto,
} from "../../unit-types/dto/unit-type.dto"
import {
  UnitRentTypeCreateDto,
  UnitRentTypeDto,
  UnitRentTypeUpdateDto,
} from "../../unit-rent-types/dto/unit-rent-type.dto"
import {
  UnitAccessibilityPriorityTypeCreateDto,
  UnitAccessibilityPriorityTypeDto,
  UnitAccessibilityPriorityTypeUpdateDto,
} from "../../unit-accessbility-priority-types/dto/unit-accessibility-priority-type.dto"
import {
  UnitAmiChartOverrideCreateDto,
  UnitAmiChartOverrideDto,
  UnitAmiChartOverrideUpdateDto,
} from "./unit-ami-chart-override.dto"

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
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
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

export class UnitCreateDto extends OmitType(UnitDto, [
  "id",
  "createdAt",
  "updatedAt",
  "amiChart",
  "unitType",
  "unitRentType",
  "priorityType",
  "amiChartOverride",
] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  amiChart?: IdDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitTypeCreateDto)
  unitType?: UnitTypeCreateDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitRentTypeCreateDto)
  unitRentType?: UnitRentTypeCreateDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitAccessibilityPriorityTypeCreateDto)
  priorityType?: UnitAccessibilityPriorityTypeCreateDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitAmiChartOverrideCreateDto)
  amiChartOverride?: UnitAmiChartOverrideCreateDto
}

export class UnitUpdateDto extends OmitType(UnitDto, [
  "id",
  "createdAt",
  "updatedAt",
  "amiChart",
  "unitType",
  "unitRentType",
  "priorityType",
  "amiChartOverride",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id?: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  createdAt?: Date

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  updatedAt?: Date

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  amiChart?: IdDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitTypeUpdateDto)
  unitType?: UnitTypeUpdateDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitRentTypeUpdateDto)
  unitRentType?: UnitRentTypeUpdateDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitAccessibilityPriorityTypeUpdateDto)
  priorityType?: UnitAccessibilityPriorityTypeUpdateDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitAmiChartOverrideUpdateDto)
  amiChartOverride?: UnitAmiChartOverrideUpdateDto
}
