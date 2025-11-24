import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  MultiselectQuestionsApplicationSectionEnum,
  MultiselectQuestionsStatusEnum,
} from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import {
  IsString,
  ValidateNested,
  ArrayMaxSize,
  IsBoolean,
  IsEnum,
  IsDefined,
} from 'class-validator';
import { MultiselectLink } from './multiselect-link.dto';
import { MultiselectOption } from './multiselect-option.dto';
import { AbstractDTO } from '../shared/abstract.dto';
import { IdDTO } from '../shared/id.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

class MultiselectQuestion extends AbstractDTO {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(MultiselectQuestionsApplicationSectionEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiProperty({
    enum: MultiselectQuestionsApplicationSectionEnum,
    enumName: 'MultiselectQuestionsApplicationSectionEnum',
  })
  applicationSection: MultiselectQuestionsApplicationSectionEnum;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  description?: string;

  // TODO: Temporarily optional until after MSQ refactor
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  isExclusive?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  hideFromListing?: boolean;

  // TODO: Temporarily optional until after MSQ refactor
  @Expose()
  // @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ type: IdDTO })
  jurisdiction?: IdDTO;

  // TODO: This will be sunseted after MSQ refactor but still required at the moment
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: IdDTO, isArray: true })
  jurisdictions: IdDTO[];

  @Expose()
  @Type(() => MultiselectLink)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiPropertyOptional({ type: MultiselectLink, isArray: true })
  links?: MultiselectLink[];

  // TODO: Temporarily optional until after MSQ refactor
  @Expose()
  // @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => MultiselectOption)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ type: MultiselectOption, isArray: true })
  multiselectOptions?: MultiselectOption[];

  // TODO: Temporarily optional until after MSQ refactor
  @Expose()
  // @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  name?: string;

  // TODO: This will be sunseted after MSQ refactor
  @Expose()
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => MultiselectOption)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiPropertyOptional({ type: MultiselectOption, isArray: true })
  options?: MultiselectOption[];

  // TODO: This will be sunseted after MSQ refactor
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  optOutText?: string;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(MultiselectQuestionsStatusEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiProperty({
    enum: MultiselectQuestionsStatusEnum,
    enumName: 'MultiselectQuestionsStatusEnum',
    example: 'draft',
  })
  status: MultiselectQuestionsStatusEnum;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  subText?: string;

  // TODO: This will be sunseted after MSQ refactor but still required at the moment
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  text: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  untranslatedName?: string;

  // TODO: This will be sunseted after MSQ refactor
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  untranslatedText?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  untranslatedOptOutText?: string;
}

export { MultiselectQuestion as default, MultiselectQuestion };
