import { Expose, Type } from 'class-transformer';
import { IsNumber, IsDefined } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { Asset } from '../assets/asset-get.dto';

export class ListingImage {
  @Expose()
  @Type(() => Asset)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  assets: Asset;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  ordinal?: number | null;
}
