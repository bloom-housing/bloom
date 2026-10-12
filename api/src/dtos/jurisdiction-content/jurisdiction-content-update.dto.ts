import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { JurisdictionContentFields } from './jurisdiction-content-fields.dto';

export class JurisdictionContentUpdate extends JurisdictionContentFields {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiPropertyOptional()
  lastUpdatedAt?: Date;

  // Stale fields a reviewer confirmed are still correct; gets the current English as its source.
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(500, { groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  @MaxLength(512, { groups: [ValidationsGroupsEnum.default], each: true })
  @ApiPropertyOptional({ type: [String] })
  confirmedSourcePaths?: string[];
}
