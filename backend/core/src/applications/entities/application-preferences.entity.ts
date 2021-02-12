import { Expose, Type } from "class-transformer"
import {
  ArrayMaxSize,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"
import { ApiProperty, getSchemaPath } from "@nestjs/swagger"
import { InputType } from "../../shared/input-type"
import { AddressCreateDto } from "../../shared/dto/address.dto"

export class FormMetadataExtraData {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(InputType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: InputType, enumName: "InputType" })
  type: InputType

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(128, { groups: [ValidationsGroupsEnum.default] })
  key: string
}

export class BooleanInput extends FormMetadataExtraData {
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  value: boolean
}

export class TextInput extends FormMetadataExtraData {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  value: string
}

export class AddressInput extends FormMetadataExtraData {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  value: AddressCreateDto
}

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

export class FormMetadata {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(128, { groups: [ValidationsGroupsEnum.default] })
  key: string

  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => FormMetadataOptions)
  options: FormMetadataOptions[]
}

export class ApplicationPreferenceOption {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(128, { groups: [ValidationsGroupsEnum.default] })
  key: string

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  checked: boolean

  @Expose()
  @ApiProperty({
    type: "array",
    items: {
      oneOf: [
        { $ref: getSchemaPath(BooleanInput) },
        { $ref: getSchemaPath(TextInput) },
        { $ref: getSchemaPath(AddressInput) },
      ],
    },
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => FormMetadataExtraData, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: "type",
      subTypes: [
        { value: BooleanInput, name: InputType.boolean },
        { value: TextInput, name: InputType.text },
        { value: AddressInput, name: InputType.address },
      ],
    },
  })
  extraData?: Array<BooleanInput | TextInput | AddressInput>
}

export class ApplicationPreference {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(128, { groups: [ValidationsGroupsEnum.default] })
  key: string

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  claimed: boolean

  @Expose()
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationPreferenceOption)
  options: Array<ApplicationPreferenceOption>
}

export const applicationPreferenceExtraModels = [BooleanInput, TextInput, AddressInput]
