import { ClassType } from "class-transformer/ClassTransformer"
import { ApiProperty } from "@nestjs/swagger"
import { IPaginationMeta } from "nestjs-typeorm-paginate/dist/interfaces"
import { Expose } from "class-transformer"

export class PaginationMeta implements IPaginationMeta {
  @Expose()
  currentPage: number
  @Expose()
  itemCount: number
  @Expose()
  itemsPerPage: number
  @Expose()
  totalItems: number
  @Expose()
  totalPages: number
}

abstract class Pagination<T> {
  @Expose()
  items: T[]
  @Expose()
  meta: PaginationMeta
}

export function PaginationFactory<T>(classType: ClassType<T>): ClassType<Pagination<T>> {
  class PaginationHost extends Pagination<T> {
    @ApiProperty({ type: () => classType })
    items: T[]
  }
  return PaginationHost
}
