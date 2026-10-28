import { ListingUtilitiesUpdate } from './listing-utility-update.dto';
import { OmitType } from '@nestjs/swagger';

export class ListingUtilitiesCreate extends OmitType(ListingUtilitiesUpdate, [
  'id',
]) {}
