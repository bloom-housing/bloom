import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';
import { ListingFeatures } from './listing-feature.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ListingFeaturesUpdate extends OmitType(ListingFeatures, [
  'createdAt',
  'id',
  'updatedAt',
]) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  id?: string;
}
