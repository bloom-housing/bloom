import { Expose, Type } from 'class-transformer';
import { AbstractDTO } from '../shared/abstract.dto';
import {
  IsDefined,
  IsString,
  IsUrl,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IdDTO } from '../shared/id.dto';

export default class Property extends AbstractDTO {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  name: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  description?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ValidateIf((o) => o.url && o.url.length > 0, {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsUrl(
    { require_protocol: true },
    { groups: [ValidationsGroupsEnum.default] },
  )
  @ApiPropertyOptional()
  url?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  urlTitle?: string;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ApiPropertyOptional({ type: IdDTO })
  jurisdictions?: IdDTO;
}
