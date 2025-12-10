import { PaginationFactory } from '../shared/pagination.dto';
import Property from './property.dto';

export class PagiantedPropertyDto extends PaginationFactory<Property>(
  Property,
) {}
