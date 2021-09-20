import { PaginationFactory } from "../../shared/dto/pagination.dto"
import { UserDto } from "./user.dto"

export class PaginatedUserListDto extends PaginationFactory<UserDto>(UserDto) {}
