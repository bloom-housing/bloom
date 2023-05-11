import { ListingQueryBuilder } from "./listing-query-builder"

export type ListingSearchParams = {
  bedrooms: string
  bathrooms: string
  counties: string[]
}

export function parseSearchString<T extends object>(format: T, search: string): T {
  // format: name:value;otherName:arrayVal1,arrayVal2

  // Fail fast on empty string
  if (search.length < 1) return

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

export function generateSearchQuery(params: ListingSearchParams) {
  const qb = new ListingQueryBuilder()

  // Find listings that have units with greater than or equal number of bedrooms
  if (params.bedrooms != null) {
    qb.whereGreaterThanEqual("bedrooms", params.bedrooms)
  }

  // Find listings that have units with greater than or equal number of bathrooms
  if (params.bathrooms != null) {
    qb.whereGreaterThanEqual("minBathrooms", params.bathrooms)
  }

  // Find listings in these counties
  if (params.counties != null) {
    qb.whereIn("counties", params.counties)
  }

  return qb
}
