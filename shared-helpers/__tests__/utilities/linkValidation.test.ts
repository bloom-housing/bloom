import { isExternalLink, isInternalLink } from "../../src/utilities/linkValidation"

describe("isExternalLink", () => {
  it("returns true for http(s) URLs", () => {
    expect(isExternalLink("http://exygy.com")).toBe(true)
    expect(isExternalLink("https://exygy.com")).toBe(true)
  })
  it("returns false for non-http URLs", () => {
    expect(isExternalLink("")).toBe(false)
    expect(isExternalLink("/path")).toBe(false)
    expect(isExternalLink("javascript:destroyComputer()")).toBe(false)
    expect(isExternalLink("https:invalid")).toBe(false)
  })
})

describe("isInternalLink", () => {
  it("returns true for relative URLs", () => {
    expect(isInternalLink("/path")).toBe(true)
    expect(isInternalLink("/")).toBe(true)
  })
  it("returns false for http or any other scheme", () => {
    expect(isInternalLink("")).toBe(false)
    expect(isInternalLink("//badsite.com")).toBe(false)
    expect(isInternalLink("http://exygy.com")).toBe(false)
    expect(isInternalLink("https://exygy.com")).toBe(false)
    expect(isInternalLink("javascript:destroyComputer()")).toBe(false)
    expect(isInternalLink("https:invalid")).toBe(false)
  })
})
