import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { Application } from './application.dto';
import { PublicAppsCount } from './public-apps-count.dto';
import { PublicAppsFiltered } from './public-apps-filtered.dto';

export class PublicAppsViewResponse {
  @Expose()
  @Type(() => PublicAppsFiltered)
  @ApiProperty({ type: PublicAppsFiltered, isArray: true })
  displayApplications: PublicAppsFiltered[];

  @Expose()
  @Type(() => PublicAppsCount)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: PublicAppsCount })
  applicationsCount: PublicAppsCount;
}
