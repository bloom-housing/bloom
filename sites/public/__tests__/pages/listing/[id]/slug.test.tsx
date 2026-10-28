import React from "react"
import { render, screen } from "@testing-library/react"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { mockNextRouter } from "../../../testUtils"
import ListingPage from "../../../../src/pages/listing/[id]/[slug]"
import { Listing, Jurisdiction } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

beforeAll(() => {
  mockNextRouter({ id: listing.id, slug: "test-slug" })
})

function renderListingPage(listingProp: Listing, jurisdictionProp: Jurisdiction) {
  return render(
    <AuthContext.Provider
      value={{
        doJurisdictionsHaveFeatureFlagOn: () => false,
      }}
    >
      <ListingPage listing={listingProp} jurisdiction={jurisdictionProp} />
    </AuthContext.Provider>
  )
}

describe("ListingPage - [id]/[slug]", () => {
  it("should render error page when listing has no data", () => {
    renderListingPage(undefined, jurisdiction)
    expect(screen.getByRole("heading", { level: 1, name: "Page not found" })).toBeInTheDocument()
  })

  it("should render ListingView when showNewSeedsDesigns is not set", () => {
    const originalEnv = process.env.showNewSeedsDesigns
    delete process.env.showNewSeedsDesigns

    renderListingPage(listing, jurisdiction)

    expect(screen.getByRole("heading", { level: 1, name: listing.name })).toBeInTheDocument()

    process.env.showNewSeedsDesigns = originalEnv
  })

  it("should render ListingViewSeeds when showNewSeedsDesigns is set", () => {
    const originalEnv = process.env.showNewSeedsDesigns
    process.env.showNewSeedsDesigns = "true"

    renderListingPage(listing, jurisdiction)

    expect(screen.getByRole("heading", { level: 1, name: listing.name })).toBeInTheDocument()
    process.env.showNewSeedsDesigns = originalEnv
  })
})
