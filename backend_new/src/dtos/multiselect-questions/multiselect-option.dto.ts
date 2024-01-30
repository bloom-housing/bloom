import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsDefined,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MultiselectLink } from './multiselect-link.dto';
import { ValidationMethod } from '../../enums/multiselect-questions/validation-method-enum';

export class MultiselectOption {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  text: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  untranslatedText?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  ordinal: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  description?: string;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => MultiselectLink)
  @ApiPropertyOptional({ type: MultiselectLink, isArray: true })
  links?: MultiselectLink[];

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  collectAddress?: boolean;

  @Expose()
  @ApiProperty({
    required: false,
    enum: ValidationMethod,
    enumName: 'ValidationMethodEnum',
  })
  validationMethod?: ValidationMethod;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  radiusSize?: number;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  collectName?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  collectRelationship?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  exclusive?: boolean;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ required: false })
  mapLayerId?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ required: false })
  mapPinPosition?: string;
}
