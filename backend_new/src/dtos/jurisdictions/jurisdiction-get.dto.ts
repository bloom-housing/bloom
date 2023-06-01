import { AbstractDTO } from '../shared/abstract.dto';
import {
  IsString,
  MaxLength,
  IsDefined,
  IsEnum,
  ArrayMaxSize,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { LanguagesEnum } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { MultiselectQuestion } from '../multiselect-questions/multiselect-question.dto';

export class Jurisdiction extends AbstractDTO {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  name: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  notificationsSignUpURL?: string | null;

  @Expose()
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(256, { groups: [ValidationsGroupsEnum.default] })
  @IsEnum(LanguagesEnum, {
    groups: [ValidationsGroupsEnum.default],
    each: true,
  })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  languages: LanguagesEnum[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => MultiselectQuestion)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  multiselectQuestions: MultiselectQuestion[];

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  partnerTerms?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  publicUrl: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  emailFromAddress: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  rentalAssistanceDefault: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  enablePartnerSettings?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  enableAccessibilityFeatures: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  enableUtilitiesIncluded: boolean | null;
}
