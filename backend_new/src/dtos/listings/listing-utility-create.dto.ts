import { OmitType } from '@nestjs/swagger';
import { ListingUtilities } from './listing-utility.dto';

export class ListingUtilitiesCreate extends OmitType(ListingUtilities, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
