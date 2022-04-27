import { Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UnitTypeDto } from "../../unit-types/dto/unit-type.dto"
import { ProgramDto } from "../../program/dto/program.dto"

export class ListingMetadataDto {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default], each: true })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ProgramDto)
  programs?: ProgramDto[]

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default], each: true })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitTypeDto)
  unitTypes?: UnitTypeDto[]
}
