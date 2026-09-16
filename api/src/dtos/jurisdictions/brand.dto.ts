import { Expose, Transform, Type } from 'class-transformer';
import {
  IsDefined,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { HEX_COLOR } from '../../utilities/brand-ramp';
import { AllowlistedTokens } from '../../validators/allowlisted-tokens';

export const FONT_HOSTS = ['fonts.googleapis.com'];

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
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ example: 'Inter' })
  fontFamily?: string;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
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
  @Transform(({ obj }) => obj?.tokens)
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @Validate(AllowlistedTokens, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: { type: 'string' },
    example: { '--button-border-radius-md': 'var(--seeds-rounded-3xl)' },
  })
  tokens?: Record<string, string>;

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
