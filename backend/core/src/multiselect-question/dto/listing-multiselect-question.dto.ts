import { ListingMultiselectQuestion } from "../entities/listing-multiselect-question.entity"
import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { MultiselectQuestionDto } from "./multiselect-question.dto"

export class ListingMultiselectQuestionDto extends OmitType(ListingMultiselectQuestion, [
  "listing",
  "multiselectQuestion",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => MultiselectQuestionDto)
  multiselectQuestion: MultiselectQuestionDto
}
