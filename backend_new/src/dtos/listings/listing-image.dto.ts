import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsDefined } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { Asset } from '../assets/asset.dto';

export class ListingImage {
  @Expose()
  @Type(() => Asset)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true, type: Asset })
  assets: Asset;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  ordinal?: number;
}
