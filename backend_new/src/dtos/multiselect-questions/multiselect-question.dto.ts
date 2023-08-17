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
import { ApiProperty } from '@nestjs/swagger';
import { AbstractDTO } from '../shared/abstract.dto';
import { MultiselectQuestionsApplicationSectionEnum } from '@prisma/client';
import { MultiselectLink } from './multiselect-link.dto';
import { MultiselectOption } from './multiselect-option.dto';
import { IdDTO } from '../shared/id.dto';

class MultiselectQuestion extends AbstractDTO {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  text: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  untranslatedText?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  untranslatedOptOutText?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  subText?: string;

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
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ApiProperty({ type: IdDTO, isArray: true, required: true })
  jurisdictions: IdDTO[];

  @Expose()
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => MultiselectOption)
  @ApiProperty({ type: MultiselectOption, isArray: true, required: false })
  options?: MultiselectOption[];

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  optOutText?: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  hideFromListing?: boolean;

  @Expose()
  @IsEnum(MultiselectQuestionsApplicationSectionEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiProperty({
    enum: MultiselectQuestionsApplicationSectionEnum,
    enumName: 'MultiselectQuestionsApplicationSectionEnum',
    required: true,
  })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  applicationSection: MultiselectQuestionsApplicationSectionEnum;
}

export { MultiselectQuestion as default, MultiselectQuestion };
