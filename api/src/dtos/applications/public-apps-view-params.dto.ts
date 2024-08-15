import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class PublicAppsViewQueryParams {
  @Expose()
  @ApiProperty({
    type: String,
    example: 'userId',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  userId: string;

  @Expose()
  @ApiPropertyOptional({
    type: String,
    example: 'filterType',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  filterType?: string;
}
