import { Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AbstractDTO } from '../shared/abstract.dto';
import { ApiProperty } from '@nestjs/swagger';

export class Accessibility extends AbstractDTO {
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  mobility?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  vision?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  hearing?: boolean | null;
}
