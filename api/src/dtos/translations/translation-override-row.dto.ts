import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { LanguagesEnum, SiteEnum } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { TranslationRowBase } from './translation-row-base.dto';

// One override row in the jurisdiction-wide list, across all sites and languages.
export class TranslationOverrideRow extends TranslationRowBase {
  @Expose()
  @IsEnum(SiteEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: SiteEnum, enumName: 'SiteEnum', nullable: true })
  site: SiteEnum | null;

  @Expose()
  @IsEnum(LanguagesEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: LanguagesEnum, enumName: 'LanguagesEnum' })
  language: LanguagesEnum;
}
