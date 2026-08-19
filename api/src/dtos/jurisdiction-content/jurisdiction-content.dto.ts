import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { LanguagesEnum } from '@prisma/client';
import { IntersectionType } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AbstractDTO } from '../shared/abstract.dto';
import { JurisdictionContentFields } from './jurisdiction-content-fields.dto';

export class JurisdictionContent extends IntersectionType(
  AbstractDTO,
  JurisdictionContentFields,
) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  jurisdictionId: string;

  @Expose()
  @IsEnum(LanguagesEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: LanguagesEnum, enumName: 'LanguagesEnum' })
  language: LanguagesEnum;
}
