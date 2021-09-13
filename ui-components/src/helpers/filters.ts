import {
  EnumListingFilterParamsComparison,
  ListingFilterKeys,
  ListingFilterParams,
} from "@bloom-housing/backend-core/types"
import { ParsedUrlQuery } from "querystring"

function getComparisonForFilter(filterKey: ListingFilterKeys) {
  switch (filterKey) {
    case ListingFilterKeys.name:
    case ListingFilterKeys.neighborhood:
    case ListingFilterKeys.status:
    case ListingFilterKeys.leasingAgents:
      return EnumListingFilterParamsComparison["="]
    case ListingFilterKeys.bedrooms:
    case ListingFilterKeys.minRent:
      return EnumListingFilterParamsComparison[">="]
    case ListingFilterKeys.maxRent:
      return EnumListingFilterParamsComparison["<="]
    case ListingFilterKeys.zipcode:
      return EnumListingFilterParamsComparison["IN"]
    case ListingFilterKeys.seniorHousing:
    case ListingFilterKeys.availability:
    case ListingFilterKeys.ami:
      return EnumListingFilterParamsComparison["NA"]
    default: {
      const _exhaustiveCheck: never = filterKey
      return _exhaustiveCheck
    }
  }
}

export function encodeToBackendFilterArray(filterParams: ListingFilterParams) {
  const filterArray = []
  for (const filterType in filterParams) {
    if (filterType in ListingFilterKeys) {
      const comparison = getComparisonForFilter(ListingFilterKeys[filterType])
      filterArray.push({
        $comparison: comparison,
        [filterType]: filterParams[filterType],
      })
    }
  }
  return filterArray
}

export function encodeToFrontendFilterString(filterParams: ListingFilterParams) {
  let queryString = ""
  for (const filterType in filterParams) {
    const value = filterParams[filterType]
    if (filterType in ListingFilterKeys && value !== undefined && value !== "") {
      queryString += `&${filterType}=${value}`
    }
  }
  return queryString
}

export function decodeFiltersFromFrontendUrl(query: ParsedUrlQuery) {
  // ListingFilterParams must have a comparison, so set one here even though it's unused.
  const filters: ListingFilterParams = {
    $comparison: EnumListingFilterParamsComparison.NA,
  }
  let foundFilterKey = false
  for (const queryKey in query) {
    if (queryKey in ListingFilterKeys) {
      filters[queryKey] = query[queryKey]
      foundFilterKey = true
    }
  }
  return foundFilterKey ? filters : undefined
}
