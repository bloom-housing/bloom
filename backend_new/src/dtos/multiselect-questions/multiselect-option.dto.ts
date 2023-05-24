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
  @ApiProperty()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  text: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  untranslatedText?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  ordinal: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  description?: string | null;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => MultiselectLink)
  @ApiProperty({ type: [MultiselectLink], required: false })
  links?: MultiselectLink[] | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  collectAddress?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  exclusive?: boolean | null;
}
