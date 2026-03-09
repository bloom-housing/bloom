import { Expose } from 'class-transformer';
import { BaseFilter } from '../shared/base-filter.dto';
import { IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { ValidationsGroupsEnum } from '../../../src/enums/shared/validation-groups-enum';
import { AgencyFilterKeys } from '../../../src/enums/agency/filter-key-enum';

export class AgencyFilterParams extends BaseFilter {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({
    example: 'uuid',
  })
  [AgencyFilterKeys.jurisdiction]?: string;
}
