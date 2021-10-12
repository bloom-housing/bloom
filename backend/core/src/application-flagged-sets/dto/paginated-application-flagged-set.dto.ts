import { PaginationFactory } from "../../shared/dto/pagination.dto"
import { Expose } from "class-transformer"
import { ApplicationFlaggedSetPaginationMeta } from "./application-flagged-set-pagination-meta"
import { ApplicationFlaggedSetDto } from "./application-flagged-set.dto"

export class PaginatedApplicationFlaggedSetDto extends PaginationFactory<ApplicationFlaggedSetDto>(
  ApplicationFlaggedSetDto
) {
  @Expose()
  meta: ApplicationFlaggedSetPaginationMeta
}
