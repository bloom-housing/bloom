import { Expose, Transform, Type } from 'class-transformer';
import {
  IsDefined,
  IsOptional,
  IsString,
  IsUrl,
  IsEnum,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { HEX_COLOR } from '../../utilities/brand-ramp';
import { BrandRadiusEnum } from '../../enums/jurisdictions/brand-radius-enum';

export const FONT_HOSTS = ['fonts.googleapis.com'];

// A family name is interpolated into the style block, so it is held to letters, digits, spaces
// and hyphens.
export const FONT_FAMILY = /^[A-Za-z0-9](?:[A-Za-z0-9 -]{0,62}[A-Za-z0-9])?$/;

// Without a display value google's css omits font-display, so the browser hides text for up to
// three seconds. An explicit choice is left alone.
const withFontDisplay = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string' || /[?&]display=/.test(value)) return value;

  return `${value}${value.includes('?') ? '&' : '?'}display=swap`;
};

const toUpperHex = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.toUpperCase() : value;

export class BrandRampDTO {
  @Expose()
  @Transform(toUpperHex)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Matches(HEX_COLOR, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ example: '#773E98' })
  base: string;

  @Expose()
  @Transform(toUpperHex)
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @Matches(HEX_COLOR, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ example: '#693786' })
  dark?: string;

  @Expose()
  @Transform(toUpperHex)
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @Matches(HEX_COLOR, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ example: '#4C2861' })
  darker?: string;

  @Expose()
  @Transform(toUpperHex)
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @Matches(HEX_COLOR, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ example: '#EFE6F5' })
  light?: string;

  @Expose()
  @Transform(toUpperHex)
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @Matches(HEX_COLOR, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ example: '#F8F4FB' })
  lighter?: string;
}

export class BrandDTO {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => BrandRampDTO)
  @ApiProperty({ type: BrandRampDTO })
  primary: BrandRampDTO;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => BrandRampDTO)
  @ApiPropertyOptional({ type: BrandRampDTO })
  secondary?: BrandRampDTO;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @Matches(FONT_FAMILY, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ example: 'Inter' })
  fontFamily?: string;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @Matches(FONT_FAMILY, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ example: 'Playfair Display' })
  headingFontFamily?: string;

  @Expose()
  @Transform(withFontDisplay)
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUrl(
    {
      protocols: ['https'],
      require_protocol: true,
      host_whitelist: FONT_HOSTS,
      disallow_auth: true,
    },
    { groups: [ValidationsGroupsEnum.default] },
  )
  @ApiPropertyOptional({
    example: 'https://fonts.googleapis.com/css2?family=Inter&display=swap',
  })
  fontUrl?: string;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @Matches(FONT_FAMILY, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ example: 'Noto Serif' })
  serifFontFamily?: string;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(BrandRadiusEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({
    enum: BrandRadiusEnum,
    enumName: 'BrandRadiusEnum',
    example: BrandRadiusEnum.xl3,
  })
  buttonRadius?: BrandRadiusEnum;

  // Response-only: built from the asset foreign keys at read time.
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  logoUrl?: string;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  faviconUrl?: string;
}
