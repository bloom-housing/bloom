import { SelectQueryBuilder } from "typeorm"

export abstract class GenericQueryBuilder<T extends { id: string }> extends SelectQueryBuilder<T> {
  pageValue?: number
  limitValue?: number
  innerFilterSubQuery?: GenericQueryBuilder<T>

  public abstract leftJoinRelationsForFilters(): GenericQueryBuilder<T>

  public abstract leftJoinAndSelectAll(): GenericQueryBuilder<T>

  public paginate(page: number, limit: number) {
    this.pageValue = page
    this.limitValue = limit
    return this
  }

  public addInnerFilterSubQuery(qb: GenericQueryBuilder<T>) {
    this.innerFilterSubQuery = qb
    return this
  }

  public async getManyAndCount(): Promise<[T[], number]> {
    if (this.pageValue && this.limitValue) {
      this.innerFilterSubQuery = this.innerFilterSubQuery
        .take(this.limitValue)
        .skip((this.pageValue - 1) * this.limitValue)
    }

    const [
      filteredEntities,
      filteredQueryCount,
    ] = await SelectQueryBuilder.prototype.getManyAndCount.call(this.innerFilterSubQuery)

    this.andWhereInIds(filteredEntities.map((e) => e.id))
    this.setParameters(this.innerFilterSubQuery.getParameters())

    const result = await this.getMany()

    return [result, filteredQueryCount]
  }
}
