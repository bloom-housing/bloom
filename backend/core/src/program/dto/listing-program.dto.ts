import { Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, ValidateNested } from "class-validator"
import { OmitType } from "@nestjs/swagger"
import { ProgramDto } from "./program.dto"
import { ListingProgram } from "../entities/listing-program.entity"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class ListingProgramDto extends OmitType(ListingProgram, ["listing", "program"] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ProgramDto)
  program: ProgramDto
}
