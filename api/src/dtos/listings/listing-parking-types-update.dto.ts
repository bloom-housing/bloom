import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ListingParkingTypes } from './listing-parking-types.dto';
import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

export class ListingParkingTypesUpdate extends OmitType(ListingParkingTypes, [
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
