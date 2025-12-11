import { Expose } from 'class-transformer';
import { AbstractDTO } from '../shared/abstract.dto';
import { IsDefined, IsString, IsUrl } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
}
