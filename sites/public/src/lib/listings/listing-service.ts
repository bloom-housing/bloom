import {
  CombinedListingFilterParams,
  EnumListingFilterParamsStatus,
  Listing,
  OrderByFieldsEnum,
  OrderParam,
  PaginatedListing,
} from "@bloom-housing/backend-core"
import axios from "axios"
import qs from "qs"
import { ListingQueryBuilder } from "./listing-query-builder"

/**
 * Consolidates listing API calls into a single class
 * This class is client-side safe
 */
export class ListingService {
  listingsEndpoint: string
  searchEndpoint: string

  /**
   * The constructor expects a full URL to the listings endpoint.  This should
   * usually come from runtimeConfig.getListingServiceUrl().  Note that while
   * this class is client-side safe, runtimeConfig is not.
   *
   * @param listingsEndpoint
   */
  constructor(listingsEndpoint: string) {
    this.listingsEndpoint = listingsEndpoint
    this.searchEndpoint = listingsEndpoint + "/combined"
  }

  /**
   * Retrieve a single local listing
   *
   * @param id
   * @param locale
   * @returns Listing
   */
  async fetchListingById(id: string, locale: string = null): Promise<Listing> {
    const request = {
      headers: null,
    }

    if (locale) {
      request.headers = { language: locale }
    }

    const response = await axios.get(`${this.listingsEndpoint}/${id}`, request)
    return response.data
  }

  /**
   * Search for internal and external listings based on filter and order criteria
   *
   * @param qb
   * @param limit
   * @returns Promise<PaginatedListing>
   */
  async searchListings(qb: ListingQueryBuilder, limit = "all"): Promise<PaginatedListing> {
    let results = Promise.resolve({
      items: [],
      meta: {
        currentPage: 0,
        itemCount: 0,
        itemsPerPage: 0,
        totalItems: 0,
        totalPages: 0,
      },
    })

    const params: {
      view: string
      limit: string
      filter: CombinedListingFilterParams[]
      orderBy?: OrderByFieldsEnum[]
      orderDir?: OrderParam[]
    } = {
      view: "base",
      limit: limit,
      filter: qb.getFilterParams(),
    }

    const orderBy = qb.getOrderByParams()

    if (orderBy) {
      params.orderBy = orderBy.fields
      params.orderDir = orderBy.direction
    }

    console.log(params)

    try {
      const response = await axios.get(this.searchEndpoint, {
        params,
        paramsSerializer: (params) => {
          return qs.stringify(params)
        },
      })

      results = response.data
    } catch (e) {
      console.log("ListingService.searchListings error: ", e)
    }

    return results
  }

  /**
   * Convenience method for fetching open listings
   *
   * @returns Promise<PaginatedListing>
   */
  async fetchOpenListings(): Promise<Array<Listing>> {
    const qb = new ListingQueryBuilder()

    qb.whereEqual("status", EnumListingFilterParamsStatus.active).addOrderBy(
      OrderByFieldsEnum.mostRecentlyPublished,
      OrderParam.DESC
    )

    // We just want the listings, not the extra stuff
    const result = await this.searchListings(qb)
    return result.items
  }
}
