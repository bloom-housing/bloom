import { Expose, Type } from 'class-transformer';
import {
  IsString,
  ValidateNested,
  ArrayMaxSize,
  IsBoolean,
  IsEnum,
  IsDefined,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDTO } from '../shared/abstract.dto';
import { MultiselectQuestionsApplicationSectionEnum } from '@prisma/client';
import { MultiselectLink } from './multiselect-link.dto';
import { MultiselectOption } from './multiselect-option.dto';
import { IdDTO } from '../shared/id.dto';

class MultiselectQuestion extends AbstractDTO {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  text: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  untranslatedText?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  untranslatedOptOutText?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  subText?: string;

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
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ApiProperty({ type: IdDTO, isArray: true })
  jurisdictions: IdDTO[];

  @Expose()
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => MultiselectOption)
  @ApiPropertyOptional({ type: MultiselectOption, isArray: true })
  options?: MultiselectOption[];

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  optOutText?: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  hideFromListing?: boolean;

  @Expose()
  @IsEnum(MultiselectQuestionsApplicationSectionEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiProperty({
    enum: MultiselectQuestionsApplicationSectionEnum,
    enumName: 'MultiselectQuestionsApplicationSectionEnum',
  })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  applicationSection: MultiselectQuestionsApplicationSectionEnum;
}

export { MultiselectQuestion as default, MultiselectQuestion };
