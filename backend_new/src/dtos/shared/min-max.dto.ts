import { Expose } from 'class-transformer';
import { IsDefined, IsNumber } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ApiProperty } from '@nestjs/swagger';

export class MinMax {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  min: number;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  max: number;
}
