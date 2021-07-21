import { formatUrlSlug, listingUrlSlug } from "../../src/shared/url-helper"

import { ArcherListing, Listing } from "../../types"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

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
  const listing: Listing = ArcherListing

  test("Generates a URL slug for a Listing", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const slug = listingUrlSlug({
      ...listing,
      // TODO: refactor this tests, creating property here is required after moving property model
      //  to the listing model.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      property: {
        buildingAddress: listing.buildingAddress,
      },
    })
    expect(slug).toEqual("archer_studios_98_archer_street_san_jose_ca")
  })
})
