import {
  IsBoolean,
  IsDefined,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { IsTranslationSourceUrl } from '../../decorators/is-translation-source-url.decorator';
import { BrandDTO } from '../jurisdictions/brand.dto';

const SAFE_PATH = /^(?!.*\.\.)[\w][\w.\-/]*$/;

export class JurisdictionBrandingMigrationDTO {
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
    example: 'sites/public/styles/overrides.scss',
  })
  overridesPath?: string;

  // Each fork names its logo differently and references it from its own layout, so the paths are
  // given.
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Matches(SAFE_PATH, { groups: [ValidationsGroupsEnum.default] })
  @MaxLength(255, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({
    type: String,
    example: 'sites/public/public/images/logo.png',
  })
  logoPath?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Matches(SAFE_PATH, { groups: [ValidationsGroupsEnum.default] })
  @MaxLength(255, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({
    type: String,
    example: 'sites/public/public/favicon.png',
  })
  faviconPath?: string;

  // Wins over whatever the stylesheet parse found, field by field. A font family needs a fontUrl
  // supplied here: a fork's self-hosted font has no google fonts url to read.
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => BrandDTO)
  @ApiPropertyOptional({ type: BrandDTO })
  brand?: BrandDTO;
}
