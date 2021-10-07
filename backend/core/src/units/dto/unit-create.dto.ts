import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { IdDto } from "../../shared/dto/id.dto"
import { UnitDto } from "./unit.dto"
import { UnitAmiChartOverrideCreateDto } from "./unit-ami-chart-override-create.dto"

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
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  amiChart?: IdDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  unitType?: IdDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  unitRentType?: IdDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  priorityType?: IdDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitAmiChartOverrideCreateDto)
  amiChartOverride?: UnitAmiChartOverrideCreateDto
}
