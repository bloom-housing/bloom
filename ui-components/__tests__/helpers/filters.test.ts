import { cleanup } from "@testing-library/react"
import {
  encodeToBackendFilterArray,
  encodeToFrontendFilterString,
  decodeFiltersFromFrontendUrl,
  ListingFilterState,
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
    const filter: ListingFilterState = {
      zipcode: "48226",
    }
    expect(encodeToBackendFilterArray(filter)).toEqual([
      {
        $comparison: EnumListingFilterParamsComparison["IN"],
        zipcode: "48226",
      },
    ])
  })

  it("should handle multiple filters", () => {
    const filter: ListingFilterState = {
      bedRoomSize: "3",
      zipcode: "48226",
    }
    expect(encodeToBackendFilterArray(filter)).toContainEqual({
      $comparison: EnumListingFilterParamsComparison["IN"],
      bedRoomSize: "3",
    })
    expect(encodeToBackendFilterArray(filter)).toContainEqual({
      $comparison: EnumListingFilterParamsComparison["IN"],
      zipcode: "48226",
    })
  })

  it("should handle multiple bedroom filters", () => {
    const filter: ListingFilterState = {
      bedRoomSize: "2,3",
    }
    expect(encodeToBackendFilterArray(filter)).toEqual([
      {
        $comparison: EnumListingFilterParamsComparison["IN"],
        bedRoomSize: "2,3",
      },
    ])
  })
})

describe("encode filter state as frontend querystring", () => {
  it("should handle single filter", () => {
    const filter: ListingFilterState = {
      zipcode: "48226",
    }
    expect(encodeToFrontendFilterString(filter)).toBe("&zipcode=48226")
  })

  it("should handle multiple filters", () => {
    const filter: ListingFilterState = {
      threeBdrm: true,
      zipcode: "48226",
    }
    expect(encodeToFrontendFilterString(filter)).toBe("&threeBdrm=true&zipcode=48226")
  })

  it("should exclude empty filters", () => {
    const filter: ListingFilterState = {
      threeBdrm: true,
      zipcode: "",
    }
    expect(encodeToFrontendFilterString(filter)).toBe("&threeBdrm=true")
  })
})

describe("get filter state from parsed url", () => {
  it("should handle single filter", () => {
    const filterString = parse("localhost:3000/listings?page=1&zipcode=48226")
    const expected: ListingFilterState = {
      zipcode: "48226",
    }
    expect(decodeFiltersFromFrontendUrl(filterString)).toStrictEqual(expected)
  })

  it("should handle multiple filters", () => {
    const filterString = parse("localhost:3000/listings?page=1&threeBdrm=true&zipcode=48226")
    const expected: ListingFilterState = {
      threeBdrm: "true",
      zipcode: "48226",
    }
    expect(decodeFiltersFromFrontendUrl(filterString)).toEqual(expected)
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
    const filterString = parse("localhost:3000/listings?page=1&unknown=blah&zipcode=48226")
    const expected: ListingFilterState = {
      zipcode: "48226",
    }
    expect(decodeFiltersFromFrontendUrl(filterString)).toStrictEqual(expected)
  })
})
