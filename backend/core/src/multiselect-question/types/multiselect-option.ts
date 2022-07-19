import { Expose, Type } from "class-transformer"
import {
  ArrayMaxSize,
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { FormMetadataExtraData } from "./form-metadata/form-metadata-extra-data"
import { ApiProperty } from "@nestjs/swagger"
import { PreferenceLink } from "../../preferences/types/preference-link"

export class MultiselectOption {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(128, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  title: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(128, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  description?: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => FormMetadataExtraData)
  @ApiProperty({ type: [FormMetadataExtraData], required: false })
  extraData?: FormMetadataExtraData[] | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => PreferenceLink)
  @ApiProperty({ type: [PreferenceLink] })
  links?: PreferenceLink[] | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  exclusive?: boolean
}
