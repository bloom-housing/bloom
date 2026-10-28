import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IdOnlyDTO } from './id-only.dto';
import { IsDate, IsDefined } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class AbstractDTO extends IdOnlyDTO {
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty()
  updatedAt: Date;
}
