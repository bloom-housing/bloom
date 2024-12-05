import { ListingSearchParams, buildSearchString, parseSearchString } from "./search"

describe("parse search string", () => {
  it("should parse expected values", () => {
    const example = {
      str: null,
      arr: [],
    }

    const searchStr = "str:abc;arr:one,two"
    const results = parseSearchString(searchStr, example)

    expect(results).toEqual({
      str: "abc",
      arr: ["one", "two"],
    })
  })

  it("should ignore unexpected values", () => {
    const example = {
      str: null,
      arr: [],
    }

    const searchStr = "str:abc;not-valid:true;arr:one,two"
    const results = parseSearchString(searchStr, example)

    expect(results).toEqual({
      str: "abc",
      arr: ["one", "two"],
    })
  })
})

describe("build search string", () => {
  it("should build expected string", () => {
    const example: ListingSearchParams = {
      bedrooms: "2",
      counties: ["county1", "county2"],
      bathrooms: null,
      minRent: null,
      monthlyRent: null,
      ids: null,
      availability: null,
    }

    const expectedStr = "bedrooms:2;counties:county1,county2"
    const actualStr = buildSearchString(example)

    expect(actualStr).toEqual(expectedStr)
  })
})
