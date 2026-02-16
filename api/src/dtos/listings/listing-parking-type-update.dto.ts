import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ListingParkingType } from './listing-parking-type.dto';
import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

export class ListingParkingTypeUpdate extends OmitType(ListingParkingType, [
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
