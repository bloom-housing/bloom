import { Expose, Type } from "class-transformer"
import { ArrayMaxSize, IsString, MaxLength, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../../shared/types/validations-groups-enum"
import { FormMetadataOptions } from "../form-metadata/form-metadata-options"

export class FormMetadata {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(128, { groups: [ValidationsGroupsEnum.default] })
  key: string

  @Expose()
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => FormMetadataOptions)
  options: FormMetadataOptions[]
}
