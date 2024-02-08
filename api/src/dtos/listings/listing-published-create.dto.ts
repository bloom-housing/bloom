import { OmitType } from '@nestjs/swagger';
import { ListingPublishedUpdate } from './listing-published-update.dto';

export class ListingPublishedCreate extends OmitType(ListingPublishedUpdate, [
  'id',
]) {}
