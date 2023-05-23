import { Listing } from "../entities/listing.entity"
import { SelectQueryBuilder } from "typeorm"
import { Pagination } from "nestjs-typeorm-paginate"
import { CombinedListingTransformer } from "./combined-listing-transformer"
import { addFilters } from "../../shared/query-filter"
import {
  combinedListingFilterTypeToFieldMap,
  combinedListingUnitFilterTypeToFieldMap,
} from "./filter-type-to-field-map"
import { OrderByFieldsEnum } from "../types/listing-orderby-enum"
import { OrderParam } from "../../applications/types/order-param"
import { HttpException, HttpStatus } from "@nestjs/common"
import { CombinedListing } from "./combined-listing.entity"
import { CombinedListingFilterParams } from "./combined-listing-filter-params"

type OrderByConditionData = {
  orderBy: string
  orderDir: "DESC" | "ASC"
  nulls?: "NULLS LAST" | "NULLS FIRST"
}

// REMOVE_WHEN_EXTERNAL_NOT_NEEDED
export class CombinedListingsQueryBuilder extends SelectQueryBuilder<CombinedListing> {
  limitValue?: number | "all"
  pageValue?: number
  addUnitSummaryFlag?: boolean

  private static shouldPaginate(limit: number | "all", page: number) {
    return limit !== "all" && limit > 0 && page > 0
  }

  private static getOrderByCondition(
    orderBy: OrderByFieldsEnum,
    orderDir: OrderParam
  ): OrderByConditionData {
    switch (orderBy) {
      case OrderByFieldsEnum.mostRecentlyUpdated:
        return { orderBy: "updated_at", orderDir }
      case OrderByFieldsEnum.status:
        return { orderBy: "status", orderDir }
      case OrderByFieldsEnum.name:
        return { orderBy: "name", orderDir }
      case OrderByFieldsEnum.waitlistOpen:
        return { orderBy: "is_waitlist_open", orderDir }
      case OrderByFieldsEnum.unitsAvailable:
        return { orderBy: "units_available", orderDir }
      case OrderByFieldsEnum.mostRecentlyClosed:
        return {
          orderBy: "closed_at",
          orderDir,
          nulls: "NULLS LAST",
        }
      case OrderByFieldsEnum.mostRecentlyPublished:
        return {
          orderBy: "published_at",
          orderDir,
          nulls: "NULLS LAST",
        }
      case OrderByFieldsEnum.applicationDates:
      case undefined:
        // Default to ordering by applicationDates (i.e. applicationDueDate
        // and applicationOpenDate) if no orderBy param is specified.
        return { orderBy: "application_due_date", orderDir }
      default:
        throw new HttpException(
          `OrderBy parameter not recognized or not yet implemented.`,
          HttpStatus.NOT_IMPLEMENTED
        )
    }
  }

  public addSearchByListingNameCondition(searchName?: string) {
    if (searchName) {
      this.andWhere(`name ILIKE :search`, { search: `%${searchName}%` })
    }
    return this
  }

  addFilters(filters?: CombinedListingFilterParams[]) {
    if (!filters) {
      return this
    }

    // These are the fields available in the unit object
    // name: "type"
    const unitSubqueryFields = {
      [combinedListingUnitFilterTypeToFieldMap.numBedrooms]: "int",
      [combinedListingUnitFilterTypeToFieldMap.numBathrooms]: "int",
      [combinedListingUnitFilterTypeToFieldMap.monthlyRent]: "int",
    }

    // separate listing filters from unit filters
    const listingFilters = []
    const unitFilters = []

    // For each filter we have...
    filters.forEach((filter) => {
      // find the active key in the filter object
      Object.keys(filter).forEach((filterKey) => {
        // see addFilters() in src/.shared/query-filter/index.ts
        if (
          filter[filterKey] === undefined ||
          filter[filterKey] === null ||
          filterKey === "$comparison" ||
          filterKey === "$include_nulls"
        ) {
          return
        }

        // If it's a unit filter add it to that list...
        if (filterKey in combinedListingUnitFilterTypeToFieldMap) {
          unitFilters.push(filter)
        } else {
          // otherwise add it to the listing filters list
          listingFilters.push(filter)
        }
      })
    })

    // Add listing filters as before
    addFilters<Array<CombinedListingFilterParams>, typeof combinedListingFilterTypeToFieldMap>(
      listingFilters,
      combinedListingFilterTypeToFieldMap,
      this
    )

    // Add unit filters to the query if we have any
    if (unitFilters.length > 0) {
      const unitSubqueryFieldString = Object.entries(unitSubqueryFields)
        .map(([name, type]) => {
          return `"${name}" ${type}`
        })
        .join(",")

      const conn = this.connection

      // This is a hack around limitations in TypeORM QueryBuilder
      // It isn't possible to build just a WHERE clause, and as far as I can tell
      // there doesn't seem to be a good way to tell it not to quote things that
      // shouldn't be quoted

      // Build a dummy query that we can pass into addFilter()
      // This lets us use existing filtering logic
      const dummyQb = conn
        .createQueryBuilder()
        .select("<ignore>", "<ignore>")
        .from("<ignore>", "<beginning-of-where>")

      // Apply filters as normal
      addFilters<
        Array<CombinedListingFilterParams>,
        typeof combinedListingUnitFilterTypeToFieldMap
      >(unitFilters, combinedListingUnitFilterTypeToFieldMap, dummyQb)

      // Convert the dummy query to string
      const unitFilterQuery = dummyQb.getQuery()

      // Find where the WHERE clause starts
      const wherePos = unitFilterQuery.indexOf("WHERE")

      // Strip out everything before the WHERE clause if it exists
      // We _should_ have a WHERE clause since there is at least one unit filter,
      // but default to an empty string just in case
      const unitFilterWhereClause = wherePos > 0 ? unitFilterQuery.substring(wherePos) : ""

      // Build our "real" subquery
      // Convert the jsonb data in the "units" field to a recordset we can query
      // We just need a count of how many units match our unit filters
      const unitSubqueryStr = `SELECT COUNT(*) as count
      FROM jsonb_to_recordset(units :: jsonb)
      AS matched_units(
        ${unitSubqueryFieldString}
      ) ${unitFilterWhereClause}`

      // This ensures that a listing is returned only if it has at least one
      // unit that matches all unit search criteria
      this.andWhere(`(${unitSubqueryStr}) > 0`, dummyQb.getParameters())
    }

    return this
  }

  addOrderConditions(orderBy?: Array<OrderByFieldsEnum>, orderDir?: Array<OrderParam>) {
    let orderByConditionDataArray = []
    if (!orderDir || !orderBy) {
      orderByConditionDataArray = [
        CombinedListingsQueryBuilder.getOrderByCondition(
          OrderByFieldsEnum.applicationDates,
          OrderParam.ASC
        ),
      ]
    } else {
      for (let i = 0; i < orderDir.length; i++) {
        orderByConditionDataArray.push(
          CombinedListingsQueryBuilder.getOrderByCondition(orderBy[i], orderDir[i])
        )
      }
    }

    for (const orderByCondition of orderByConditionDataArray) {
      this.addOrderBy(orderByCondition.orderBy, orderByCondition.orderDir, orderByCondition.nulls)
    }

    return this
  }

  paginate(limit?: number | "all", page?: number) {
    const realLimit = limit == "all" || limit > 0 ? limit : 10 // set a default limit
    const realPage = page > 0 ? page : 1 // set a default page

    this.limitValue = realLimit
    this.pageValue = realPage

    if (CombinedListingsQueryBuilder.shouldPaginate(realLimit, realPage)) {
      // Calculate the number of listings to skip (because they belong to lower page numbers).
      const offset = (realPage - 1) * (realLimit as number)
      // Add the limit and offset to the inner query, so we only do the full
      // join on the listings we want to show.
      this.offset(offset).limit(realLimit as number)
    }
    return this
  }

  public async getManyListingsAndCount(): Promise<[Listing[], number]> {
    // run both queries at the same time to improve performance
    const [results, count] = await Promise.all([this.getRawMany(), this.getCount()])

    // Our version of typeorm is too old to use any of the transformers available in newer versions
    // We'll do it ourselves instead
    const transformer = new CombinedListingTransformer()
    return [transformer.transformAll(results), count]
  }

  public async getManyPaginated(): Promise<Pagination<Listing>> {
    const [listings, count] = await this.getManyListingsAndCount()

    const shouldPaginate = CombinedListingsQueryBuilder.shouldPaginate(
      this.limitValue,
      this.pageValue
    )

    const itemsPerPage = shouldPaginate ? (this.limitValue as number) : listings.length
    const totalItems = shouldPaginate ? count : listings.length
    const currentPage = shouldPaginate ? this.pageValue : 1

    const paginationInfo = {
      currentPage: currentPage,
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
}
