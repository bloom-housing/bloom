import {
  EnumListingFilterParamsComparison,
  AvailabilityFilterEnum,
  ListingFilterKeys,
} from "@bloom-housing/backend-core/types"
import { ParsedUrlQuery } from "querystring"

// TODO(#629): Refactor filter state storage strategy
// Currently, the knowledge of "what a filter is" is spread across multiple
// places: getComparisonForFilter(), ListingFilterState, FrontendListingFilterStateKeys,
// ListingFilterKeys, the encode/decode methods, and the various enums with options
// for the filters. It could be worth unifying this into a ListingFilterStateManager
// class that can hold all this in one place. Work toward this is in
// https://github.com/CityOfDetroit/bloom/pull/484, but was set aside.

// On the frontend, we assume a filter will always use the same comparison. (For
// example, that minRent will always use a >= comparison.) The backend doesn't
// make this assumption, so we need to tell it what comparison to use.
function getComparisonForFilter(filterKey: ListingFilterKeys) {
  switch (filterKey) {
    case ListingFilterKeys.name:
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
    case ListingFilterKeys.minAmiPercentage:
      return EnumListingFilterParamsComparison["NA"]
    default: {
      const _exhaustiveCheck: never = filterKey
      return _exhaustiveCheck
    }
  }
}

// Define the keys we expect to see in the frontend URL. These are also used for
// the filter state object, ListingFilterState.
export const FrontendListingFilterStateKeys = {
  ...ListingFilterKeys,
  includeNulls: "includeNulls" as const,
}
// The types in this interface are `string | ...` because we don't currently parse
// the values pulled from the URL querystring to their types, so they could be
// strings or the type the form fields set them to be.
// TODO: Update `decodeFiltersFromFrontendUrl` to parse each filter into its
// correct type, so we can remove the `string` type from these fields.
export interface ListingFilterState {
  [FrontendListingFilterStateKeys.availability]?: string | AvailabilityFilterEnum
  [FrontendListingFilterStateKeys.bedrooms]?: string | number
  [FrontendListingFilterStateKeys.zipcode]?: string
  [FrontendListingFilterStateKeys.minRent]?: string | number
  [FrontendListingFilterStateKeys.maxRent]?: string | number
  [FrontendListingFilterStateKeys.seniorHousing]?: string | boolean
  [FrontendListingFilterStateKeys.includeNulls]?: boolean
  [FrontendListingFilterStateKeys.minAmiPercentage]?: string | number
}

export function encodeToBackendFilterArray(filterState: ListingFilterState) {
  const filterArray = []
  for (const filterType in filterState) {
    // Only include things that are a backend filter type. The keys of
    // ListingFilterState are a superset of ListingFilterKeys that may include
    // keys not recognized by the backend, so we check against ListingFilterKeys
    // here.
    if (filterType in ListingFilterKeys) {
      const comparison = getComparisonForFilter(ListingFilterKeys[filterType])
      filterArray.push({
        $comparison: comparison,
        $include_nulls: filterState[FrontendListingFilterStateKeys.includeNulls],
        [filterType]: filterState[filterType],
      })
    }
  }
  return filterArray
}

export function encodeToFrontendFilterString(filterState: ListingFilterState) {
  let queryString = ""
  for (const filterType in filterState) {
    const value = filterState[filterType]
    if (filterType in FrontendListingFilterStateKeys && value !== undefined && value !== "") {
      queryString += `&${filterType}=${value}`
    }
  }
  return queryString
}

export function decodeFiltersFromFrontendUrl(
  query: ParsedUrlQuery
): ListingFilterState | undefined {
  const filterState: ListingFilterState = {}
  let foundFilterKey = false
  for (const queryKey in query) {
    if (queryKey in FrontendListingFilterStateKeys && query[queryKey] !== "") {
      filterState[queryKey] = query[queryKey]
      foundFilterKey = true
    }
  }
  return foundFilterKey ? filterState : undefined
}
