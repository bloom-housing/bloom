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
import { ApiProperty } from '@nestjs/swagger';
import { IdDTO } from '../shared/id.dto';

export class Jurisdiction extends AbstractDTO {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  name: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  notificationsSignUpUrl?: string;

  @Expose()
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(256, { groups: [ValidationsGroupsEnum.default] })
  @IsEnum(LanguagesEnum, {
    groups: [ValidationsGroupsEnum.default],
    each: true,
  })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    required: true,
    enum: LanguagesEnum,
    enumName: 'LanguagesEnum',
    isArray: true,
  })
  languages: LanguagesEnum[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true, type: IdDTO, isArray: true })
  multiselectQuestions: IdDTO[];

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  partnerTerms?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  publicUrl: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  emailFromAddress: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  rentalAssistanceDefault: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  enablePartnerSettings?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  enableAccessibilityFeatures: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  enableUtilitiesIncluded: boolean;
}
