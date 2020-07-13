import { formatUrlSlug, listingUrlSlug } from "../../src/lib/url_helper"
import { Listing } from "@bloom-housing/core"
import triton from "../../listings/triton-test.json"

describe("formatUrlSlug", () => {
  test("reformats strings properly", () => {
    expect(formatUrlSlug("snake_case")).toEqual("snake_case")
    expect(formatUrlSlug("SnakeCase")).toEqual("snake_case")
    expect(formatUrlSlug("Mix of spaces_and-hyphens")).toEqual("mix_of_spaces_and_hyphens")
    expect(formatUrlSlug("Lots@of&weird    spaces&^&!@^*&AND OTHER_CHARS")).toEqual(
      "lots_of_weird_spaces_and_other_chars"
    )
  })

  test("with an empty string", () => {
    expect(formatUrlSlug("")).toEqual("")
  })
})

describe("listingUrlSlug", () => {
  // Force cast to listing - should we add a dependency to `listingsLoader` instead?
  const listing = (triton as unknown) as Listing

  test("Generates a URL slug for a Listing", () => {
    const slug = listingUrlSlug(listing)
    expect(slug).toEqual("test_triton_55_triton_park_lane_foster_city_ca")
  })
})
