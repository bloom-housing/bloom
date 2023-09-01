import { PaginationFactory } from '../shared/pagination.dto';
import { Listing } from './listing.dto';

export class PaginatedListingDto extends PaginationFactory<Listing>(Listing) {}
