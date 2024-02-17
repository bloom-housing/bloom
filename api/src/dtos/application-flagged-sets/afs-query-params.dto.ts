import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsUUID } from 'class-validator';
import { View } from '../../enums/application-flagged-sets/view';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { PaginationAllowsAllQueryParams } from '../shared/pagination.dto';

export class AfsQueryParams extends PaginationAllowsAllQueryParams {
  @Expose()
  @ApiProperty()
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  listingId: string;

  @Expose()
  @ApiPropertyOptional({
    enum: View,
    enumName: 'AfsView',
    example: 'pending',
  })
  @IsEnum(View, { groups: [ValidationsGroupsEnum.default] })
  view?: View;
}
