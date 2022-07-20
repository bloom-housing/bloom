import { MultiselectQuestionCreateDto } from "./listing-multiselect-create.dto"
import { Expose } from "class-transformer"
import { IsString, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class MultiselectQuestionUpdateDto extends MultiselectQuestionCreateDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID()
  id: string
}
