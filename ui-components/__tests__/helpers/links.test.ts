import { isExternalLink, isInternalLink } from "../../src/helpers/links"

describe("isExternalLink helper", () => {
  it("works only for http(s) URLs", () => {
    expect(isExternalLink("http://exygy.com")).toBe(true)
    expect(isExternalLink("https://exygy.com")).toBe(true)
  })
  it("doesn't allow non-http URLs", () => {
    expect(isExternalLink("")).toBe(false)
    expect(isExternalLink("/path")).toBe(false)
    expect(isExternalLink("javascript:destroyComputer()")).toBe(false)
    expect(isExternalLink("https:invalid")).toBe(false)
  })
})

describe("isInternalLink helper", () => {
  it("works only for relative URLs", () => {
    expect(isInternalLink("/path")).toBe(true)
    expect(isInternalLink("/")).toBe(true)
  })
  it("doesn't allow http or any other scheme", () => {
    expect(isInternalLink("")).toBe(false)
    expect(isInternalLink("//badsite.com")).toBe(false)
    expect(isInternalLink("http://exygy.com")).toBe(false)
    expect(isInternalLink("https://exygy.com")).toBe(false)
    expect(isInternalLink("javascript:destroyComputer()")).toBe(false)
    expect(isInternalLink("https:invalid")).toBe(false)
  })
})
