import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ListingFeatureField {
  @Expose()
  @ApiProperty({
    example: 'wheelchairRamp',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  id: string;
}
