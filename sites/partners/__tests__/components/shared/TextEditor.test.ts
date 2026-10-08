import { linkHref } from "../../../src/components/shared/TextEditor"

describe("linkHref", () => {
  it("adds https:// to a bare address", () => {
    expect(linkHref("example.com/apply")).toEqual("https://example.com/apply")
  })

  it.each(["https://example.com", "http://example.com", "mailto:help@example.com", "tel:5550100"])(
    "keeps %s, which already has a scheme",
    (url) => {
      expect(linkHref(url)).toEqual(url)
    }
  )

  it("keeps a path on this site", () => {
    expect(linkHref("/listings")).toEqual("/listings")
  })

  // Two slashes name another host, so it is not a path on this site.
  it("gives a protocol-relative address https", () => {
    expect(linkHref("//example.com")).toEqual("https://example.com")
  })
})
