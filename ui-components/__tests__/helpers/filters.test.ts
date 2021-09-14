import { cleanup } from "@testing-library/react"
import {
  encodeToBackendFilterArray,
  encodeToFrontendFilterString,
  decodeFiltersFromFrontendUrl,
} from "../../src/helpers/filters"
import { parse } from "querystring"
import {
  EnumListingFilterParamsComparison,
  EnumListingFilterParamsStatus,
  ListingFilterParams,
} from "@bloom-housing/backend-core/types"

afterEach(cleanup)

describe("encode backend filter array", () => {
  it("should handle single filter", () => {
    const filter: ListingFilterParams = {
      status: EnumListingFilterParamsStatus.active,
      // $comparison is a required field even though it won't be used on the frontend. Will be fixed in #484.
      $comparison: EnumListingFilterParamsComparison.NA,
    }
    expect(encodeToBackendFilterArray(filter)).toEqual([
      {
        $comparison: EnumListingFilterParamsComparison["="],
        status: EnumListingFilterParamsStatus.active,
      },
    ])
  })
  it("should handle multiple filters", () => {
    const filter: ListingFilterParams = {
      name: "Name",
      status: EnumListingFilterParamsStatus.active,
      // $comparison is a required field even though it won't be used on the frontend. Will be fixed in #484.
      $comparison: EnumListingFilterParamsComparison.NA,
    }
    expect(encodeToBackendFilterArray(filter)).toEqual([
      {
        $comparison: EnumListingFilterParamsComparison["="],
        name: "Name",
      },
      {
        $comparison: EnumListingFilterParamsComparison["="],
        status: EnumListingFilterParamsStatus.active,
      },
    ])
  })
})

describe("encode frontend filter string", () => {
  it("should handle single filter", () => {
    const filter: ListingFilterParams = {
      status: EnumListingFilterParamsStatus.active,
      // $comparison is a required field even though it won't be used on the frontend. Will be fixed in #484.
      $comparison: EnumListingFilterParamsComparison.NA,
    }
    expect(encodeToFrontendFilterString(filter)).toBe("&status=active")
  })
  it("should handle multiple filters", () => {
    const filter: ListingFilterParams = {
      name: "Name",
      status: EnumListingFilterParamsStatus.active,
      // $comparison is a required field even though it won't be used on the frontend. Will be fixed in #484.
      $comparison: EnumListingFilterParamsComparison.NA,
    }
    expect(encodeToFrontendFilterString(filter)).toBe("&name=Name&status=active")
  })
  it("should exclude empty filters", () => {
    const filter: ListingFilterParams = {
      name: "Name",
      status: undefined,
      zipcode: "",
      // $comparison is a required field even though it won't be used on the frontend. Will be fixed in #484.
      $comparison: EnumListingFilterParamsComparison.NA,
    }
    expect(encodeToFrontendFilterString(filter)).toBe("&name=Name")
  })
})

describe("get filter from parsed url", () => {
  it("should handle single filter", () => {
    const filterString = parse("localhost:3000/listings?page=1&status=active")
    const expected: ListingFilterParams = {
      status: EnumListingFilterParamsStatus.active,
      // $comparison is a required field even though it won't be used on the frontend. Will be fixed in #484.
      $comparison: EnumListingFilterParamsComparison.NA,
    }
    expect(decodeFiltersFromFrontendUrl(filterString)).toStrictEqual(expected)
  })
  it("should handle multiple filters", () => {
    const filterString = parse("localhost:3000/listings?page=1&status=active&name=Name")
    const expected: ListingFilterParams = {
      status: EnumListingFilterParamsStatus.active,
      name: "Name",
      // $comparison is a required field even though it won't be used on the frontend. Will be fixed in #484.
      $comparison: EnumListingFilterParamsComparison.NA,
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
      // $comparison is a required field even though it won't be used on the frontend. Will be fixed in #484.
      $comparison: EnumListingFilterParamsComparison.NA,
    }
    expect(decodeFiltersFromFrontendUrl(filterString)).toStrictEqual(expected)
  })
})
