import { OmitType } from "@nestjs/swagger"
import { Expose, plainToClass, Transform, Type } from "class-transformer"
import { IsOptional, IsUUID, ValidateNested } from "class-validator"
import { IdDto } from "../../shared/dto/id.dto"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UnitGroupAmiLevel } from "../entities/unit-group-ami-level.entity"

export class UnitGroupAmiLevelDto extends OmitType(UnitGroupAmiLevel, [
  "unitGroup",
  "amiChart",
] as const) {
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
}

export class UnitGroupAmiLevelCreateDto extends OmitType(UnitGroupAmiLevelDto, [
  "id",
  "amiChart",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  amiChart?: IdDto
}

export class UnitGroupAmiLevelUpdateDto extends OmitType(UnitGroupAmiLevelCreateDto, [
  "amiChart",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID()
  id?: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  amiChart?: IdDto
}
