import { FormMetadataExtraData } from "./form-metadata-extra-data"
import { Expose } from "class-transformer"
import { IsString, MaxLength } from "class-validator"
import { ValidationsGroupsEnum } from "../../../shared/types/validations-groups-enum"

export class TextInput extends FormMetadataExtraData {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  value: string
}
