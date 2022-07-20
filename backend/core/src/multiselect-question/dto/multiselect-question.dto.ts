import { MultiselectQuestion } from "../entities/multiselect-question.entity"
import { Expose, Type } from "class-transformer"
import { IsOptional, ValidateNested } from "class-validator"
import { OmitType } from "@nestjs/swagger"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { IdNameDto } from "../../shared/dto/idName.dto"

export class MultiselectQuestionDto extends OmitType(MultiselectQuestion, [
  "listingMultiselectQuestions",
  "jurisdictions",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdNameDto)
  jurisdictions?: IdNameDto[]
}
