import { FormMetadataExtraData } from "./form-metadata-extra-data"
import { Expose } from "class-transformer"
import { IsBoolean } from "class-validator"
import { ValidationsGroupsEnum } from "../../../shared/types/validations-groups-enum"
import { ApiProperty } from "@nestjs/swagger"

export class BooleanInput extends FormMetadataExtraData {
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  value: boolean
}
