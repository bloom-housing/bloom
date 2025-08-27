import { Expose } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
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
}
