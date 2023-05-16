import { buildSearchString, parseSearchString } from "./search"

describe("parse search string", () => {
  it("should parse expected values", () => {
    const example = {
      str: null,
      arr: [],
    }

    const searchStr = "str:abc;arr:one,two"
    const results = parseSearchString(example, searchStr)

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
    const results = parseSearchString(example, searchStr)

    expect(results).toEqual({
      str: "abc",
      arr: ["one", "two"],
    })
  })
})

describe("build search string", () => {
  it("should build expected string", () => {
    const example = {
      str: "abc",
      arr: ["one", "two"],
    }

    const expectedStr = "str:abc;arr:one,two"
    const actualStr = buildSearchString(example)

    expect(actualStr).toEqual(expectedStr)
  })
})
