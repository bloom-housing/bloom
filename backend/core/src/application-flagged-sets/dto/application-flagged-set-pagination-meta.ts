import { PaginationMeta } from "../../shared/dto/pagination.dto"
import { Expose } from "class-transformer"

export class ApplicationFlaggedSetPaginationMeta extends PaginationMeta {
  @Expose()
  totalFlagged: number
}
