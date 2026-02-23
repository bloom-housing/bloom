import { Expose, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class UserFilterParams {
  @Expose()
  @ApiPropertyOptional({
    type: Boolean,
    example: true,
  })
  @Transform(({ value }) =>
    typeof value === 'boolean' ? value : value === 'true',
  )
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  isPortalUser?: boolean;

  @Expose()
  @ApiPropertyOptional({
    type: Boolean,
    example: false,
  })
  @Transform(({ value }) =>
    typeof value === 'boolean' ? value : value === 'true',
  )
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  isAdvocateUser?: boolean;
}
