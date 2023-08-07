import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { InputType } from '../../enums/shared/input-type-enum';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { Address } from '../addresses/address-get.dto';

class FormMetadataExtraData {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(InputType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: InputType, enumName: 'InputType' })
  type: InputType;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  key: string;
}

class AddressInput extends FormMetadataExtraData {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty()
  value: Address;
}

class BooleanInput extends FormMetadataExtraData {
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  value: boolean;
}

class TextInput extends FormMetadataExtraData {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  value: string;
}

export class ApplicationMultiselectQuestionOption {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  key: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  checked: boolean;

  @Expose()
  @ApiProperty({
    type: 'array',
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
      property: 'type',
      subTypes: [
        { value: BooleanInput, name: InputType.boolean },
        { value: TextInput, name: InputType.text },
        { value: AddressInput, name: InputType.address },
      ],
    },
  })
  extraData: Array<BooleanInput | TextInput | AddressInput>;
}