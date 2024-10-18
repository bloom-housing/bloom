import { Expose, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
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
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ApplicationsFilterEnum, { groups: [ValidationsGroupsEnum.default] })
  filterType?: ApplicationsFilterEnum;

  @Expose()
  @ApiPropertyOptional()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (obj: any) => {
      return obj.value === 'true' || obj.value === true;
    },
    { toClassOnly: true },
  )
  includeLotteryApps?: boolean;
}
