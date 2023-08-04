import { Listing } from "../entities/listing.entity"
import { OrderByFieldsEnum } from "../types/listing-orderby-enum"
import { HttpException, HttpStatus } from "@nestjs/common"
import { ListingFilterParams } from "../dto/listing-filter-params"
import { addFilters } from "../../shared/query-filter"
import { filterTypeToFieldMap } from "../dto/filter-type-to-field-map"
import { OrderParam } from "../../applications/types/order-param"
import { SelectQueryBuilder } from "typeorm"
import { Pagination } from "nestjs-typeorm-paginate"

type OrderByConditionData = {
  orderBy: string
  orderDir: "DESC" | "ASC"
  nulls?: "NULLS LAST" | "NULLS FIRST"
}

export class ListingsQueryBuilder extends SelectQueryBuilder<Listing> {
  limitValue?: number | "all"
  pageValue?: number
  innerFilteredQuery?: ListingsQueryBuilder
  addUnitSummaryFlag?: boolean

  addFilters(filters?: ListingFilterParams[]) {
    if (!filters) {
      return this
    }
    addFilters<Array<ListingFilterParams>, typeof filterTypeToFieldMap>(
      filters,
      filterTypeToFieldMap,
      this
    )
    return this
  }

  addOrderConditions(orderBy?: Array<OrderByFieldsEnum>, orderDir?: Array<OrderParam>) {
    let orderByConditionDataArray = []
    if (!orderDir || !orderBy) {
      orderByConditionDataArray = [
        ListingsQueryBuilder.getOrderByCondition(OrderByFieldsEnum.status, OrderParam.ASC),
      ]
    } else {
      for (let i = 0; i < orderDir.length; i++) {
        orderByConditionDataArray.push(
          ListingsQueryBuilder.getOrderByCondition(orderBy[i], orderDir[i])
        )
      }
    }

    for (const orderByCondition of orderByConditionDataArray) {
      if (orderByCondition.orderBy === "listings.status") {
        const orderStr =
          orderByCondition.orderDir === "ASC"
            ? `CASE WHEN ${orderByCondition.orderBy} = 'pending' THEN 1 WHEN ${orderByCondition.orderBy} = 'active' THEN 2 WHEN ${orderByCondition.orderBy} = 'closed' THEN 3 END`
            : `CASE WHEN ${orderByCondition.orderBy} = 'closed' THEN 1 WHEN ${orderByCondition.orderBy} = 'active' THEN 2 WHEN ${orderByCondition.orderBy} = 'pending' THEN 3 END`
        this.addOrderBy(orderStr)
        this.addOrderBy("listings.applicationDueDate", orderByCondition.orderDir)
      } else {
        this.addOrderBy(orderByCondition.orderBy, orderByCondition.orderDir, orderByCondition.nulls)
      }
    }

    return this
  }

  public addSearchByListingNameCondition(searchName?: string) {
    if (searchName) {
      this.andWhere(`${this.alias}.name ILIKE :search`, { search: `%${searchName}%` })
    }
    return this
  }

  paginate(limit?: number | "all", page?: number) {
    this.limitValue = limit
    this.pageValue = page

    if (ListingsQueryBuilder.shouldPaginate(limit, page)) {
      // Calculate the number of listings to skip (because they belong to lower page numbers).
      const offset = (page - 1) * (limit as number)
      // Add the limit and offset to the inner query, so we only do the full
      // join on the listings we want to show.
      this.offset(offset).limit(limit as number)
    }
    return this
  }

  addInnerFilteredQuery(qb: ListingsQueryBuilder) {
    this.innerFilteredQuery = qb
    this.andWhere(`${this.alias}.id IN (` + qb.getQuery() + ")")
    // Set the inner WHERE params on the outer query, as noted in the TypeORM docs.
    // (WHERE params are the values passed to andWhere() that TypeORM escapes
    // and substitues for the `:paramName` placeholders in the WHERE clause.)
    this.setParameters(qb.getParameters())
    return this
  }

  public async getManyPaginated(): Promise<Pagination<Listing>> {
    let listings: Listing[], count: number

    if (this.innerFilteredQuery) {
      listings = await this.getMany()
      count = await this.innerFilteredQuery.getCount()
    } else {
      ;[listings, count] = await this.getManyAndCount()
    }

    const shouldPaginate = ListingsQueryBuilder.shouldPaginate(
      this.limitValue || this.innerFilteredQuery.limitValue,
      this.pageValue || this.innerFilteredQuery.pageValue
    )

    const itemsPerPage = shouldPaginate
      ? (this.limitValue as number) || (this.innerFilteredQuery.limitValue as number)
      : listings.length

    const totalItems = shouldPaginate ? count : listings.length
    const paginationInfo = {
      currentPage: shouldPaginate ? this.pageValue || this.innerFilteredQuery.pageValue : 1,
      itemCount: listings.length,
      itemsPerPage: itemsPerPage,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / itemsPerPage), // will be 1 if no pagination
    }

    return {
      items: listings,
      meta: paginationInfo,
      // nestjs-typeorm-paginate leaves these empty if no route is defined
      // This matches what other paginated endpoints, such as the applications
      // service, currently return.
      links: {
        first: "",
        previous: "",
        next: "",
        last: "",
      },
    }
  }

  private static shouldPaginate(limit: number | "all", page: number) {
    return limit !== "all" && limit > 0 && page > 0
  }

  private static getOrderByCondition(
    orderBy: OrderByFieldsEnum,
    orderDir: OrderParam
  ): OrderByConditionData {
    switch (orderBy) {
      case OrderByFieldsEnum.mostRecentlyUpdated:
        return { orderBy: "listings.updated_at", orderDir }
      case OrderByFieldsEnum.status:
        return { orderBy: "listings.status", orderDir }
      case OrderByFieldsEnum.name:
        return { orderBy: "listings.name", orderDir }
      case OrderByFieldsEnum.waitlistOpen:
        return { orderBy: "listings.isWaitlistOpen", orderDir }
      case OrderByFieldsEnum.unitsAvailable:
        return { orderBy: "property.unitsAvailable", orderDir }
      case OrderByFieldsEnum.mostRecentlyClosed:
        return {
          orderBy: "listings.closedAt",
          orderDir,
          nulls: "NULLS LAST",
        }
      case OrderByFieldsEnum.mostRecentlyPublished:
        return {
          orderBy: "listings.publishedAt",
          orderDir,
          nulls: "NULLS LAST",
        }
      case OrderByFieldsEnum.marketingType:
        return { orderBy: "listings.marketingType", orderDir }
      case OrderByFieldsEnum.applicationDates:
      case undefined:
        // Default to ordering by applicationDates (i.e. applicationDueDate
        // and applicationOpenDate) if no orderBy param is specified.
        return { orderBy: "listings.applicationDueDate", orderDir }
      default:
        throw new HttpException(
          `OrderBy parameter not recognized or not yet implemented.`,
          HttpStatus.NOT_IMPLEMENTED
        )
    }
  }
}
