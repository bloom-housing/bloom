import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { LanguagesEnum } from '@prisma/client';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsTranslationSourceUrl } from '../../decorators/is-translation-source-url.decorator';

const SAFE_PATH = /^(?!.*\.\.)[\w][\w.\-/]*$/;

export class TranslationOverrideMigrationDTO {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @MinLength(1, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    type: String,
    example: 'Bloomington',
  })
  jurisdictionName: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    type: Boolean,
    example: false,
  })
  commit: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    type: Boolean,
    example: false,
  })
  skipExisting: boolean;

  @Expose()
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayNotEmpty({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(LanguagesEnum, {
    each: true,
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiPropertyOptional({
    enum: LanguagesEnum,
    enumName: 'LanguagesEnum',
    isArray: true,
    example: ['es'],
  })
  languages?: LanguagesEnum[];

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsTranslationSourceUrl({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({
    type: String,
    example: 'https://raw.githubusercontent.com/bloom-housing/bloom',
  })
  repositoryUrl?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Matches(SAFE_PATH, { groups: [ValidationsGroupsEnum.default] })
  @MaxLength(255, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({
    type: String,
    example: 'main',
  })
  gitRef?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Matches(SAFE_PATH, { groups: [ValidationsGroupsEnum.default] })
  @MaxLength(255, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({
    type: String,
    example: 'sites/public/page_content/locale_overrides',
  })
  publicPath?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Matches(SAFE_PATH, { groups: [ValidationsGroupsEnum.default] })
  @MaxLength(255, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({
    type: String,
    example: 'sites/partners/page_content/overrides',
  })
  partnersPath?: string;
}
