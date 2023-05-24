import { PaginationFactory } from '../shared/pagination.dto';
import { ListingGet } from './listing-get.dto';

export class PaginatedListingDto extends PaginationFactory<ListingGet>(
  ListingGet,
) {}
