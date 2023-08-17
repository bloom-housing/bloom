import { IsDefined, IsBoolean } from 'class-validator';
import { Expose } from 'class-transformer';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessDTO {
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  success: boolean;
}
