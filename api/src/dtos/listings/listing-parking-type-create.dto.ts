import { OmitType } from '@nestjs/swagger';
import { ListingParkingTypeUpdate } from './listing-parking-type-update.dto';

export class ListingParkingTypeCreate extends OmitType(
  ListingParkingTypeUpdate,
  ['id'],
) {}
