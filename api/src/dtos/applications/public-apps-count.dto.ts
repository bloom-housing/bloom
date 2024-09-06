import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsDefined } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class PublicAppsCount {
  @Expose()
  @ApiProperty()
  total: number;

  @Expose()
  @ApiProperty()
  lottery: number;

  @Expose()
  @ApiProperty()
  closed: number;

  @Expose()
  @ApiProperty()
  open: number;
}
