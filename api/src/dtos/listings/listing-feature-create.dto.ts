import { ListingFeaturesUpdate } from './listing-feature-update.dto';
import { OmitType } from '@nestjs/swagger';

export class ListingFeaturesCreate extends OmitType(ListingFeaturesUpdate, [
  'id',
]) {}
