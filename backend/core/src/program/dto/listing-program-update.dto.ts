import { Expose, Type } from "class-transformer"
import { ListingProgramDto } from "./listing-program.dto"
import { IsDefined, IsOptional, ValidateNested } from "class-validator"
import { OmitType } from "@nestjs/swagger"
import { IdDto } from "../../shared/dto/id.dto"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class ListingProgramUpdateDto extends OmitType(ListingProgramDto, ["program"] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  program: IdDto
}
