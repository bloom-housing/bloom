import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsDefined, IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ActivityLogItem {
  @Expose()
  @ApiProperty()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  metadata: {
    targetPropertyName: string;
    propertyPath: string;
  };

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  name: string;

  @Expose()
  @ApiProperty()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  logDate: Date;
}
