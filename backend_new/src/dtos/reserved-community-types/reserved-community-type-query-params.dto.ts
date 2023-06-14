import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ReservedCommunityTypeQueryParams {
  @Expose()
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  jurisdictionId?: string;
}
