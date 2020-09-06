import { IsString, IsUUID } from "class-validator"
import { PreferenceCreateDto } from "./preference.create.dto"
import { Expose } from "class-transformer"

export class PreferenceUpdateDto extends PreferenceCreateDto {
  @Expose()
  @IsString()
  @IsUUID()
  id: string
}
