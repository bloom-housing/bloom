import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { AssetCreate } from '../assets/asset-create.dto';
import { Expose, Type } from 'class-transformer';
import { IsString, IsUUID, ValidateNested } from 'class-validator';
import { ListingEvent } from './listing-event.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ListingEventUpdate extends OmitType(ListingEvent, [
  'assets',
  'createdAt',
  'id',
  'updatedAt',
]) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetCreate)
  @ApiPropertyOptional({ type: AssetCreate })
  assets?: AssetCreate;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  id?: string;
}
