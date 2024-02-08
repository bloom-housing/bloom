import { Expose } from 'class-transformer';
import { IsDefined, IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ApiProperty } from '@nestjs/swagger';

export class MinMaxCurrency {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  min: string;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  max: string;
}
