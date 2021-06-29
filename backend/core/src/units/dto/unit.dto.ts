import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { Unit } from "../entities/unit.entity"
import { Exclude, Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator"
import { AmiChartDto } from "../../ami-charts/dto/ami-chart.dto"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { IdDto } from "../../shared/dto/id.dto"

export class UnitDto extends OmitType(Unit, [
  "property",
  "amiChart",
  "unitTypeRef",
  "unitRentType",
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
  @Type(() => IdDto)
  unitTypeRef?: IdDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  unitRentType?: IdDto
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
