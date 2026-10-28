import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { PublicAppsCount } from './public-apps-count.dto';
import { PublicAppsFiltered } from './public-apps-filtered.dto';
import { PaginationFactory } from '../shared/pagination.dto';

export class PublicAppsViewResponse extends PaginationFactory<PublicAppsFiltered>(
  PublicAppsFiltered,
) {
  @Expose()
  @Type(() => PublicAppsCount)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: PublicAppsCount })
  applicationsCount: PublicAppsCount;
}
