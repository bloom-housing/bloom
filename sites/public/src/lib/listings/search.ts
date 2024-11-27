import { ListingQueryBuilder } from "./listing-query-builder"
import { FilterAvailabilityEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export type ListingSearchParams = {
  bedrooms: string
  bathrooms: string
  minRent: string
  monthlyRent: string
  counties: string[]
  availability: FilterAvailabilityEnum
  ids: string[]
}

/**
 * Parses a search string into an object
 *
 * The format object describes the expected output.  If the value of a property
 * in the template is an array, it will attempt to split the value on commas and
 * assign the result. If not, it will assign the result directly as a string value.
 *
 * @param format
 * @param search
 * @returns
 */
export function parseSearchString<T extends object>(search: string, format: T): T {
  // format: name:value;otherName:arrayVal1,arrayVal2

  // Fail fast on empty string
  if (search == undefined || search == null || search.length < 1) return

  // Copy format to our results
  const results = {} as T
  Object.assign(results, format)

  // First, split by semicolon
  const searchInputs = search.split(";")

  searchInputs.forEach((input) => {
    // It has to have a colon in it
    if (input.indexOf(":") < 0) {
      console.log(`Invalid search input [${input}]; invalid format`)
      return
    }

    const parts = input.split(":")

    // There can only be two parts: name and value
    if (parts.length > 2) {
      console.log(`Invalid search input [${input}]; too many components`)
      return
    }

    const name = parts[0]

    // Make sure it's allowed
    if (!(name in format)) {
      console.log(`Cannot assign unrecognized search parameter "${name}"`)
      return
    }

    // Check the values
    const value = parts[1]

    // If it is supposed to be an array, treat it like one
    if (Array.isArray(results[name])) {
      // This is a "dumb" way of splitting an array
      // If the values themselves have commas, it will split into the wrong pieces
      // No values we're expecting have commas, though, so not a problem for now
      results[name] = value.split(",")
    } else {
      results[name] = value
    }
  })

  return results
}

/**
 * Builds a search string based on input values
 *
 * @param input
 * @returns
 */
export function buildSearchString(input: ListingSearchParams) {
  // For each non-null key in the input, return a serialized value, then join all together
  return Object.entries(input)
    .filter(([_, value]) => {
      return value !== null && value != ""
    })
    .map(([key, value]) => {
      let strVal
      if (Array.isArray(value)) {
        strVal = value.join(",")
      } else {
        strVal = value.toString()
      }

      return `${key}:${strVal}`
    })
    .join(";")
}

export function generateSearchQuery(params: ListingSearchParams) {
  const qb = new ListingQueryBuilder()

  // Find listings that have units with greater than or equal number of bedrooms
  if (params.bedrooms != null) {
    qb.whereGreaterThanEqual("bedrooms", params.bedrooms)
  }

  // Find listings that have units with greater than or equal number of bathrooms
  if (params.bathrooms != null) {
    qb.whereGreaterThanEqual("bathrooms", params.bathrooms)
  }

  if (params.minRent && params.minRent != "") {
    qb.whereGreaterThanEqual("monthlyRent", params.minRent)
  }

  // Find listings that have units with rent less than or equal to requested amount
  if (params.monthlyRent && params.monthlyRent != "") {
    qb.whereLessThanEqual("monthlyRent", params.monthlyRent)
  }

  // Find listings in these counties
  if (Array.isArray(params.counties) && params.counties.length > 0) {
    qb.whereIn("counties", params.counties)
  }

  // Find listings with these ids
  if (Array.isArray(params.ids) && params.ids.length > 0) {
    qb.whereIn("ids", params.ids)
  }

  if (params.availability) {
    qb.whereEqual("availability", params.availability)
  }

  return qb
}
