import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { LanguagesEnum, SiteEnum, TranslationOrigin } from '@prisma/client';
import { IsDate, IsEnum, IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

// One override row in the jurisdiction-wide list, across all sites and languages.
export class TranslationOverrideRow {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  key: string;

  @Expose()
  @IsEnum(SiteEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: SiteEnum, enumName: 'SiteEnum', nullable: true })
  site: SiteEnum | null;

  @Expose()
  @IsEnum(LanguagesEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: LanguagesEnum, enumName: 'LanguagesEnum' })
  language: LanguagesEnum;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  value: string;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @IsEnum(TranslationOrigin, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: TranslationOrigin,
    enumName: 'TranslationOrigin',
    nullable: true,
  })
  origin: TranslationOrigin | null;
}
