import { Repository } from "typeorm"
import { Pagination } from "nestjs-typeorm-paginate"

export class GenericRepository<Entity> extends Repository<Entity> {
  protected static buildPagination<T>(items: T[], pageParam, limitParam, totalItems): Pagination<T> {
    return {
      items: items,
      meta: {
        currentPage: pageParam,
        itemCount: items.length,
        itemsPerPage: limitParam,
        totalItems: totalItems,
        totalPages: Math.ceil(totalItems / limitParam)
      },
      links: {
        first: "",
        previous: "",
        next: "",
        last: ""
      }
    }
  }
}
