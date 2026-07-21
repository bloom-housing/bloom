import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
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
  @IsEnum(SiteEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  site: SiteEnum;
}

// The Partners global read is jurisdiction-independent and always site = partners, so it
// takes only the language.
export class PartnersTranslationsQueryParams {
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
}
