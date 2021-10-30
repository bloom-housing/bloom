import { PreferenceCreateDto } from "./preference-create.dto"
import { Expose } from "class-transformer"
import { IsString, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class PreferenceUpdateDto extends PreferenceCreateDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID()
  id: string
}
