import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsEnum, IsString, IsUUID } from 'class-validator';
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

  // Paths of fields whose English source has changed since this row was saved. Derived on read from
  // the hashes stored alongside each value, which are not themselves part of the response.
  @Expose()
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiProperty({ type: [String] })
  staleFields: string[];
}
