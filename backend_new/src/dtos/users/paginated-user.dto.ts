import { PaginationFactory } from '../shared/pagination.dto';
import { User } from './user.dto';

export class PaginatedUserDto extends PaginationFactory<User>(User) {}
