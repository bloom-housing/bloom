import { OmitType } from '@nestjs/swagger';
import { ListingNeighborhoodAmenitiesUpdate } from './listing-neighborhood-amenities-update.dto';

export class ListingNeighborhoodAmenitiesCreate extends OmitType(
  ListingNeighborhoodAmenitiesUpdate,
  ['id'],
) {}
