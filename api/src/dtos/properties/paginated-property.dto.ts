import { PaginationFactory } from '../shared/pagination.dto';
import Property from './property.dto';

export class PaginatedPropertyDto extends PaginationFactory<Property>(
  Property,
) {}
