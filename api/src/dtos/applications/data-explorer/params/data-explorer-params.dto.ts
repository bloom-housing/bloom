import { Expose, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../../../enums/shared/validation-groups-enum';
import { APIFilters } from './data-explorer-filters.dto';
export class DataExplorerParams {
  @Expose()
  @ApiPropertyOptional({
    type: String,
    example: 'jurisdictionId',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  jurisdictionId?: string;

  @Expose()
  @ApiPropertyOptional({
    type: String,
    example: 'userId',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  userId?: string;

  @Expose()
  @ApiPropertyOptional({
    type: APIFilters,
    description: 'Filters to apply to the report data',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => APIFilters)
  filters?: APIFilters;
}
