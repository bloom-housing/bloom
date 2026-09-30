import { Expose } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { LanguagesEnum } from '@prisma/client';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class JurisdictionContentQueryParams {
  @Expose()
  @ApiPropertyOptional({
    enum: LanguagesEnum,
    enumName: 'LanguagesEnum',
    example: 'es',
  })
  @IsEnum(LanguagesEnum, { groups: [ValidationsGroupsEnum.default] })
  language?: LanguagesEnum;
}
