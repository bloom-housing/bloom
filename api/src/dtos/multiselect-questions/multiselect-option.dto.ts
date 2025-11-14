import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsDefined,
  IsString,
  ValidateNested,
} from 'class-validator';
import { MultiselectLink } from './multiselect-link.dto';
import { AbstractDTO } from '../shared/abstract.dto';
import { IdDTO } from '../shared/id.dto';
import { ValidationMethod } from '../../enums/multiselect-questions/validation-method-enum';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class MultiselectOption extends AbstractDTO {
  // TODO: This will be sunseted after MSQ refactor
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  collectAddress?: boolean;

  // TODO: This will be sunseted after MSQ refactor
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  collectName?: boolean;

  // TODO: This will be sunseted after MSQ refactor
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  collectRelationship?: boolean;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  description?: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  exclusive?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  isOptOut?: boolean;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => MultiselectLink)
  @ApiPropertyOptional({ type: MultiselectLink, isArray: true })
  links?: MultiselectLink[];

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  mapLayerId?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  mapPinPosition?: string;

  @Expose()
  // TODO: Temporarily optional until after MSQ refactor
  // @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ApiPropertyOptional({ type: IdDTO })
  multiselectQuestion?: IdDTO;

  @Expose()
  // TODO: Temporarily optional until after MSQ refactor
  // @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  name?: string;

  @Expose()
  // @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  ordinal: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  radiusSize?: number;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  shouldCollectAddress?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  shouldCollectName?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  shouldCollectRelationship?: boolean;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  text: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  untranslatedName?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  untranslatedText?: string;

  @Expose()
  @ApiProperty({
    required: false,
    enum: ValidationMethod,
    enumName: 'ValidationMethodEnum',
  })
  validationMethod?: ValidationMethod;
}
