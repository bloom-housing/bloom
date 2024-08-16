import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ApplicationsFilterEnum } from '../../enums/applications/filter-enum';

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
    enum: ApplicationsFilterEnum,
    enumName: 'ApplicationsFilterEnum',
    example: 'all',
  })
  @IsEnum(ApplicationsFilterEnum, { groups: [ValidationsGroupsEnum.default] })
  filterType?: ApplicationsFilterEnum;
}
