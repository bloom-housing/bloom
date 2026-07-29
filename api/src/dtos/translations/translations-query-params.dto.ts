import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsDefined, IsEnum } from 'class-validator';
import { LanguagesEnum, SiteEnum } from '@prisma/client';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class TranslationsQueryParams {
  @Expose()
  @ApiPropertyOptional({
    enum: LanguagesEnum,
    enumName: 'LanguagesEnum',
    example: 'es',
  })
  @IsEnum(LanguagesEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  language?: LanguagesEnum;

  @Expose()
  @ApiProperty({
    enum: SiteEnum,
    enumName: 'SiteEnum',
    example: 'public',
  })
  // @IsDefined rejects a missing site (skipMissingProperties skips @IsEnum alone).
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(SiteEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  site: SiteEnum;
}

// The Partners global read is jurisdiction-independent and always site = partners.
export class PartnersTranslationsQueryParams extends OmitType(
  TranslationsQueryParams,
  ['site'] as const,
) {}
