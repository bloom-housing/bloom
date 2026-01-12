import { Expose } from 'class-transformer';
import { PaginationAllowsAllQueryParams } from '../shared/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class PropertyQueryParams extends PaginationAllowsAllQueryParams {
  @Expose()
  @ApiPropertyOptional({
    example: 'search',
  })
  @MinLength(3, {
    message: 'Search must be at least 3 characters',
    groups: [ValidationsGroupsEnum.default],
  })
  search?: string;

  @Expose()
  @ApiPropertyOptional({
    example: 'uuid',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  jurisdiction?: string;
}
