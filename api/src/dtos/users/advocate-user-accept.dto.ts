import { ApiProperty } from '@nestjs/swagger';
import { IdDTO } from '../shared/id.dto';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class AdvocateUserAccept {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ApiProperty()
  advocateId: IdDTO;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  isAccepted: boolean;
}
