import { Expose } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class UserFilterParams {
  @Expose()
  @ApiPropertyOptional({
    type: Boolean,
    example: true,
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  isPortalUser?: boolean;
}
