import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { UserFilterKeys } from '../../enums/user_accounts/filter-key-enum';

export class UserFilterParams {
  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
    required: false,
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [UserFilterKeys.isPartner]?: boolean;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
    required: false,
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [UserFilterKeys.isPortalUser]?: boolean;
}
