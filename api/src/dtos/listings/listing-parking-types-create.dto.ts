import { OmitType } from '@nestjs/swagger';
import { ListingParkingTypesUpdate } from './listing-parking-types-update.dto';

export class ListingParkingTypesCreate extends OmitType(
  ListingParkingTypesUpdate,
  ['id'],
) {}
