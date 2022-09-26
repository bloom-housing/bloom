import { BaseFilter } from "../../shared/dto/filter.dto"
import { Expose } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { MultiselectQuestionFilterKeys } from "./multiselect-question-filter-keys"
import { ApplicationSection } from "../types/multiselect-application-section-enum"

export class MultiselectQuestionsFilterParams extends BaseFilter {
  @Expose()
  @ApiProperty({
    type: String,
    example: "uuid",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [MultiselectQuestionFilterKeys.jurisdiction]?: string;

  @Expose()
  @ApiProperty({
    type: String,
    example: "preferences",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [MultiselectQuestionFilterKeys.applicationSection]?: ApplicationSection
}
