import { OmitType } from '@nestjs/swagger';
import { ListingFeatures } from './listing-feature.dto';

export class ListingFeaturesCreate extends OmitType(ListingFeatures, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
