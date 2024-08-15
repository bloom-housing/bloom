import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { Application } from './application.dto';
import { PublicAppsCount } from './public-apps-count.dto';

export class PublicAppsViewResponse {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => Application)
  @ApiProperty({ type: Application, isArray: true })
  displayApplications: Application[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => PublicAppsCount)
  applicationsCount: PublicAppsCount;
}
