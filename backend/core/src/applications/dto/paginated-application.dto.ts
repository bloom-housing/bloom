import { PaginationFactory } from "../../shared/dto/pagination.dto"
import { ApplicationDto } from "./application.dto"

export class PaginatedApplicationDto extends PaginationFactory<ApplicationDto>(ApplicationDto) {}
