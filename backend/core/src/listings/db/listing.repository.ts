import { EntityRepository } from "typeorm"
import Listing from "../entities/listing.entity"
import { ListingsQueryParams } from "../dto/listings-query-params"
import { summarizeUnitsByTypeAndRent } from "../../shared/units-transformations"
import { Pagination } from "nestjs-typeorm-paginate"
import { ListingsQueryBuilder } from "./listings-query-builder"
import { ListingStatus } from "../types/listing-status-enum"
import { GenericRepository } from "../../shared/db/generic.repository"

@EntityRepository(Listing)
export class ListingRepository extends GenericRepository<Listing> {
  public async list(queryParams: ListingsQueryParams): Promise<Pagination<Listing>> {
    let innerFilteredQuery = this.getListingsQueryBuilder()
      .leftJoinRelationsForFilters()
      .addFilters(queryParams.filter)

    let qb = this.getListingsQueryBuilder()
    qb = qb.leftJoinAndSelectAll()
      .addInnerFilterSubQuery(innerFilteredQuery)
      .addOrderFromFieldEnum(queryParams.orderBy)
      .addOrderBy("units.maxOccupancy", "ASC", "NULLS LAST")
      .paginate(queryParams.page, queryParams.limit)

    let [listings, count] = await qb.getManyAndCount()
    const paginatedResult = GenericRepository.buildPagination(listings, queryParams.page, queryParams.limit, count)

    for (const listing of paginatedResult.items) {
      listing.unitsSummarized = {
        amiPercentages: [], byAMI: [], byUnitType: [], hmi: undefined, priorityTypes: [], unitTypes: [],
        byUnitTypeAndRent: summarizeUnitsByTypeAndRent(listing.property.units)
      }
    }

    return paginatedResult
  }

  public async listOverdueListings(): Promise<Array<{id: string, applicationDueDate?: Date, status: ListingStatus}>> {
    return await this.getListingsQueryBuilder()
      .select(["listings.id", "listings.applicationDueDate", "listings.status"])
      .where(`listings.status = '${ListingStatus.active}'`)
      .andWhere(`listings.applicationDueDate IS NOT NULL`)
      .andWhere(`listings.applicationDueDate < NOW()`)
      .getMany()
  }

  public async getListingById(id: string) {
    return this.getListingsQueryBuilder()
      .leftJoinAndSelectAll()
      .where("listings.id = :id", { id })
      .addDefaultOrderBy()
      .getOne()
  }

  private getListingsQueryBuilder() {
    return new ListingsQueryBuilder(this.createQueryBuilder("listings"))
  }
}
