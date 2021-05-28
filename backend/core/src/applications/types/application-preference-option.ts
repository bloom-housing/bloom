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
import { ApiProperty, getSchemaPath } from "@nestjs/swagger"
import { BooleanInput } from "./form-metadata/boolean-input"
import { TextInput } from "./form-metadata/text-input"
import { AddressInput } from "./form-metadata/address-input"
import { FormMetadataExtraData } from "./form-metadata/form-metadata-extra-data"
import { InputType } from "../../shared/types/input-type"

export class ApplicationPreferenceOption {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(128, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  key: string

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  checked: boolean

  @Expose()
  @ApiProperty({
    type: "array",
    required: false,
    items: {
      oneOf: [
        { $ref: getSchemaPath(BooleanInput) },
        { $ref: getSchemaPath(TextInput) },
        { $ref: getSchemaPath(AddressInput) },
      ],
    },
  })
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
  extraData: Array<BooleanInput | TextInput | AddressInput>
}
