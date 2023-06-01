import { PaginationFactory } from '../shared/pagination.dto';
import { Application } from './application-get.dto';

export class PaginatedApplicationDto extends PaginationFactory<Application>(
  Application,
) {}
