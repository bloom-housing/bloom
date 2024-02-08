import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AbstractDTO } from '../shared/abstract.dto';

export class UnitAccessibilityPriorityType extends AbstractDTO {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString()
  @ApiProperty()
  name: string;
}
