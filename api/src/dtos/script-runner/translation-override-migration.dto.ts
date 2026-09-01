import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { LanguagesEnum } from '@prisma/client';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TranslationOverrideMigrationDTO {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
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
  @IsUrl(
    { protocols: ['https'], require_protocol: true },
    { groups: [ValidationsGroupsEnum.default] },
  )
  @ApiPropertyOptional({
    type: String,
    example: 'https://raw.githubusercontent.com/bloom-housing/bloom',
  })
  repositoryUrl?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Matches(/^[\w.\-/]+$/, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({
    type: String,
    example: 'main',
  })
  gitRef?: string;
}
