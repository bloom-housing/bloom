import { FormMetadataExtraData } from "./form-metadata-extra-data"
import { Expose } from "class-transformer"
import { IsBoolean } from "class-validator"
import { ValidationsGroupsEnum } from "../../../shared/types/validations-groups-enum"

export class BooleanInput extends FormMetadataExtraData {
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  value: boolean
}
