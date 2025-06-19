import React from "react"
import { render, cleanup, screen } from "@testing-library/react"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { MainDetails } from "../../../../src/components/listing/listing_sections/MainDetails"
import { oneLineAddress } from "@bloom-housing/shared-helpers"
import { ReviewOrderTypeEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

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
    expect(screen.getByText("View on Map")).toBeDefined()
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
          listingFeatures: {},
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
})
