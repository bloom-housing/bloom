import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsDefined,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ApiProperty } from '@nestjs/swagger';
import { MultiselectLink } from './multiselect-link.dto';

export class MultiselectOption {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  text: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  untranslatedText?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  ordinal: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  description?: string;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => MultiselectLink)
  @ApiProperty({ type: MultiselectLink, isArray: true, required: false })
  links?: MultiselectLink[];

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  collectAddress?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  exclusive?: boolean;
}
