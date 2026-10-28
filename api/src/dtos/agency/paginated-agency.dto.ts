import { PaginationFactory } from '../shared/pagination.dto';
import Agency from './agency.dto';

export class PaginatedAgencyDto extends PaginationFactory<Agency>(Agency) {}
