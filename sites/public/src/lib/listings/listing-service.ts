import {
  ListingMapMarker,
  ListingOrderByKeys,
  ListingsQueryParams,
  ListingsService,
  ListingViews,
  OrderByEnum,
  PaginatedListing,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ListingQueryBuilder } from "./listing-query-builder"

export const searchListings = async (
  qb: ListingQueryBuilder,
  limit: number | "all" = "all",
  page = 1,
  listingsService: ListingsService
): Promise<PaginatedListing> => {
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

  const params: ListingsQueryParams = {
    view: ListingViews.base,
    limit: limit || "all",
    page: page,
    filter: qb.getFilterParams(),
    orderBy: [ListingOrderByKeys.mostRecentlyPublished],
    orderDir: [OrderByEnum.desc],
  }

  try {
    const response = await listingsService.listCombined({
      body: { ...params },
    })
    results = response
  } catch (e) {
    console.log("ListingService.searchListings error: ", e)
  }

  return results
}

export const searchMapMarkers = async (
  qb: ListingQueryBuilder,
  listingsService: ListingsService
): Promise<ListingMapMarker[]> => {
  const params: ListingsQueryParams = {
    limit: "all",
    filter: qb.getFilterParams(),
  }

  try {
    const response = await listingsService.mapMarkers({ body: { ...params } })
    return response
  } catch (e) {
    console.log("ListingService.searchMapMarkers error: ", e)
  }
}
