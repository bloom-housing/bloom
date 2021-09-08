import { cleanup } from "@testing-library/react"
import {
  encodeToBackendFilterArray,
  encodeToFrontendFilterString,
  decodeFiltersFromFrontendUrl,
} from "../../src/helpers/filters"
import { parse } from "querystring"
import {
  EnumListingFilterParamsComparison,
  ListingFilterParams,
} from "@bloom-housing/backend-core/types"

afterEach(cleanup)

describe("encode backend filter array", () => {
  it("should handle single filter", () => {
    const filter: ListingFilterParams = {
      neighborhood: "Neighborhood",
      // $comparison is a required field even though it won't be used on the frontend. Will be fixed in #484.
      $comparison: EnumListingFilterParamsComparison.NA,
    }
    expect(encodeToBackendFilterArray(filter)).toBe([
      {
        $comparison: EnumListingFilterParamsComparison["="],
        neighborhood: "Neighborhood",
      },
    ])
  })
  it("should handle multiple filters", () => {
    const filter: ListingFilterParams = {
      name: "Name",
      neighborhood: "Neighborhood",
      // $comparison is a required field even though it won't be used on the frontend. Will be fixed in #484.
      $comparison: EnumListingFilterParamsComparison.NA,
    }
    expect(encodeToBackendFilterArray(filter)).toBe([
      {
        $comparison: EnumListingFilterParamsComparison["="],
        name: "Name",
      },
      {
        $comparison: EnumListingFilterParamsComparison["="],
        neighborhood: "Neighborhood",
      },
    ])
  })
})

describe("encode frontend filter string", () => {
  it("should handle single filter", () => {
    const filter: ListingFilterParams = {
      neighborhood: "Neighborhood",
    }
    expect(encodeToFrontendFilterString(filter)).toBe("&neighborhood=Neighborhood")
  })
  it("should handle multiple filters", () => {
    const filter: ListingFilterParams = {
      name: "Name",
      neighborhood: "Neighborhood",
    }
    expect(encodeToFrontendFilterString(filter)).toBe("&name=Name&neighborhood=Neighborhood")
  })
  it("should exclude empty filters", () => {
    const filter: ListingFilterParams = {
      name: "Name",
      neighborhood: "",
    }
    expect(encodeToFrontendFilterString(filter)).toBe("&name=Name")
  })
})

describe("get filter from parsed url", () => {
  it("should handle single filter", () => {
    const filterString = parse("localhost:3000/listings?page=1&neighborhood=Neighborhood")
    const expected: ListingFilterParams = {
      neighborhood: "Neighborhood",
    }
    expect(decodeFiltersFromFrontendUrl(filterString)).toStrictEqual(expected)
  })
  it("should handle multiple filters", () => {
    const filterString = parse("localhost:3000/listings?page=1&neighborhood=Neighborhood&name=Name")
    const expected: ListingFilterParams = {
      neighborhood: "Neighborhood",
      name: "Name",
    }
    expect(decodeFiltersFromFrontendUrl(filterString)).toStrictEqual(expected)
  })
  it("should handle no filters", () => {
    const filterString = parse("localhost:3000/listings?page=1")
    expect(decodeFiltersFromFrontendUrl(filterString)).toBe(undefined)
  })
  it("should handle no known filter keys", () => {
    const filterString = parse("localhost:3000/listings?page=1&unknown=blah")
    expect(decodeFiltersFromFrontendUrl(filterString)).toBe(undefined)
  })
  it("should handle some known filters", () => {
    const filterString = parse("localhost:3000/listings?page=1&unknown=blah&name=Name")
    const expected: ListingFilterParams = {
      name: "Name",
    }
    expect(decodeFiltersFromFrontendUrl(filterString)).toStrictEqual(expected)
  })
})
