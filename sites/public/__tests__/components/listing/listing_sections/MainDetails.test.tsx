import React from "react"
import { render, cleanup, screen } from "@testing-library/react"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { MainDetails } from "../../../../src/components/listing/listing_sections/MainDetails"
import { oneLineAddress } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

afterEach(cleanup)

describe("<MainDetails>", () => {
  it("shows nothing if no listing", () => {
    render(<MainDetails listing={null} jurisdiction={jurisdiction} />)
    expect(screen.queryByText(listing.name)).toBeNull()
  })
  it("shows all content", () => {
    render(<MainDetails listing={listing} jurisdiction={jurisdiction} />)
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(listing.name)
    expect(screen.getByText(oneLineAddress(listing.listingsBuildingAddress))).toBeDefined()
    expect(screen.getByText("View on map")).toBeDefined()
    expect(screen.getByText(listing.developer)).toBeDefined()
    expect(screen.getByAltText("A picture of the building")).toBeDefined()
  })
  it("shows no tags", () => {
    render(
      <MainDetails
        listing={{
          ...listing,
          reviewOrderType: ReviewOrderTypeEnum.lottery,
          reservedCommunityTypes: null,
          listingFeatures: { id: "1", createdAt: new Date(), updatedAt: new Date() },
        }}
        jurisdiction={jurisdiction}
      />
    )
    expect(screen.queryByTestId("listing-tags")).toBeNull()
  })
  it("shows reserved tag", () => {
    render(
      <MainDetails
        listing={{
          ...listing,
          reviewOrderType: ReviewOrderTypeEnum.lottery,
          reservedCommunityTypes: { id: "id", name: "veteran" },
        }}
        jurisdiction={jurisdiction}
      />
    )
    expect(screen.getByTestId("listing-tags")).toBeDefined()
    expect(screen.getAllByText("Veteran").length).toBeGreaterThan(0)
  })
  it("hides reserved tag when swapCommunityTypeWithPrograms is true", () => {
    const view = render(
      <MainDetails
        listing={listing}
        jurisdiction={{
          ...jurisdiction,
          featureFlags: [
            ...jurisdiction.featureFlags,
            {
              name: FeatureFlagEnum.swapCommunityTypeWithPrograms,
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              active: true,
              description: "",
              jurisdictions: [],
            },
          ],
        }}
      />
    )
    expect(view.queryByText("Veteran")).toBeNull()
  })
})
