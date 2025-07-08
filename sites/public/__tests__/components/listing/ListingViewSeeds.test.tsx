import React from "react"
import { render } from "@testing-library/react"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { ListingViewSeeds } from "../../../src/components/listing/ListingViewSeeds"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

describe("<ListingViewSeeds>", () => {
  it("shows error state if listing is null", () => {
    const view = render(<ListingViewSeeds listing={null} jurisdiction={jurisdiction} />)
    expect(view.getByText("Page Not Found")).toBeDefined()
    expect(view.queryByText(listing.name)).toBeNull()
  })

  it("shows listing name if listing is defined", () => {
    const view = render(<ListingViewSeeds listing={listing} jurisdiction={jurisdiction} />)
    expect(view.getByRole("heading", { level: 1 })).toHaveTextContent(listing.name)
  })

  it("doesn't show listing updated at for a default jurisdiction", () => {
    const view = render(<ListingViewSeeds listing={listing} jurisdiction={jurisdiction} />)
    expect(view.queryByText("Listing Updated: Dec 31, 2019")).toBeNull()
  })

  it("shows listing updated at when the jurisdiction allows it", () => {
    const view = render(
      <ListingViewSeeds
        listing={listing}
        jurisdiction={{
          ...jurisdiction,
          featureFlags: [
            ...jurisdiction.featureFlags,
            {
              id: "test_id",
              createdAt: new Date(),
              updatedAt: new Date(),
              description: "",
              active: true,
              jurisdictions: [],
              name: FeatureFlagEnum.enableListingUpdatedAt,
            },
          ],
        }}
      />
    )
    expect(view.getAllByText("Listing Updated: Dec 31, 2019")).toHaveLength(2)
  })
})
