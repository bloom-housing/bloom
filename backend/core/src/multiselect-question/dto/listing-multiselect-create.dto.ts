import { OmitType } from "@nestjs/swagger"
import { MultiselectQuestionDto } from "./multiselect-question.dto"

export class MultiselectQuestionCreateDto extends OmitType(MultiselectQuestionDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}
