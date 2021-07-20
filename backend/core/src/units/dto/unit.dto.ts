import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { Unit } from "../entities/unit.entity"
import { Exclude, Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator"
import { AmiChartDto } from "../../ami-charts/dto/ami-chart.dto"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UnitTypeDto } from "../../unit-types/dto/unit-type.dto"
import { UnitRentTypeDto } from "../../unit-rent-types/dto/unit-rent-type.dto"
import { UnitAccessibilityPriorityTypeDto } from "../../unit-accessbility-priority-types/dto/unit-accessibility-priority-type.dto"

export class UnitDto extends OmitType(Unit, [
  "property",
  "amiChart",
  "unitType",
  "unitRentType",
  "priorityType",
] as const) {
  @Exclude()
  @ApiHideProperty()
  property

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AmiChartDto)
  amiChart?: AmiChartDto | null

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
}

export class UnitCreateDto extends OmitType(UnitDto, [
  "id",
  "createdAt",
  "updatedAt",
  "amiChart",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AmiChartDto)
  amiChart?: AmiChartDto | null
}

export class UnitUpdateDto extends UnitCreateDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID()
  id: string
}
