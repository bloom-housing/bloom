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
import { ListingMultiselectQuestion } from '../listings/listing-multiselect-question.dto';
import { MultiselectQuestionsApplicationSectionEnum } from '@prisma/client';
import { Jurisdiction } from '../jurisdictions/jurisdiction.dto';
import { MultiselectLink } from './multiselect-link.dto';
import { MultiselectOption } from './multiselect-option.dto';

class MultiselectQuestion extends AbstractDTO {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  text: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  untranslatedText?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  untranslatedOptOutText?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  subText?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  description?: string | null;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => MultiselectLink)
  @ApiProperty({ type: [MultiselectLink] })
  links?: MultiselectLink[] | null;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingMultiselectQuestion)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  listings: ListingMultiselectQuestion[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Jurisdiction)
  jurisdictions: Jurisdiction[];

  @Expose()
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => MultiselectOption)
  @ApiProperty({ type: [MultiselectOption] })
  options?: MultiselectOption[] | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  optOutText?: string | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
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
