import { Expose, Type } from "class-transformer"
import { ArrayMaxSize, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../../shared/types/validations-groups-enum"
import { FormMetadataExtraData } from "./form-metadata-extra-data"

export class FormMetadataOptions {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(128, { groups: [ValidationsGroupsEnum.default] })
  key: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => FormMetadataExtraData)
  extraData?: FormMetadataExtraData[]
}
