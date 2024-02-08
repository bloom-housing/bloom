import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AssetCreate } from '../assets/asset-create.dto';
import { ListingEvent } from './listing-event.dto';

export class ListingEventCreate extends OmitType(ListingEvent, [
  'id',
  'createdAt',
  'updatedAt',
  'assets',
]) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetCreate)
  @ApiPropertyOptional({ type: AssetCreate })
  assets?: AssetCreate;
}
