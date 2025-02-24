import { Expose, Type } from 'class-transformer';
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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LanguagesEnum, UserRoleEnum } from '@prisma/client';
import { FeatureFlag } from '../feature-flags/feature-flag.dto';
import { AbstractDTO } from '../shared/abstract.dto';
import { IdDTO } from '../shared/id.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class Jurisdiction extends AbstractDTO {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  name: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
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
    enum: LanguagesEnum,
    enumName: 'LanguagesEnum',
    isArray: true,
  })
  languages: LanguagesEnum[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: IdDTO, isArray: true })
  multiselectQuestions: IdDTO[];

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  partnerTerms?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  publicUrl: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  emailFromAddress: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  rentalAssistanceDefault: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  enablePartnerSettings?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  enablePartnerDemographics?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  enableListingOpportunity?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  enableGeocodingPreferences?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  enableGeocodingRadiusMethod?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  allowSingleUseCodeLogin: boolean;

  @Expose()
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(UserRoleEnum, {
    groups: [ValidationsGroupsEnum.default],
    each: true,
  })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: UserRoleEnum,
    enumName: 'UserRoleEnum',
    example: [UserRoleEnum.admin],
    isArray: true,
  })
  listingApprovalPermissions: UserRoleEnum[];

  @Expose()
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(UserRoleEnum, {
    groups: [ValidationsGroupsEnum.default],
    each: true,
  })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: UserRoleEnum,
    enumName: 'UserRoleEnum',
    example: [UserRoleEnum.admin],
    isArray: true,
  })
  duplicateListingPermissions: UserRoleEnum[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => FeatureFlag)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: FeatureFlag, isArray: true })
  featureFlags: FeatureFlag[];
}
