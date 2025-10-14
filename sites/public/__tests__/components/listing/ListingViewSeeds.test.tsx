import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { ListingViewSeeds } from "../../../src/components/listing/ListingViewSeeds"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

describe("<ListingViewSeeds>", () => {
  it("shows error state if listing is null", () => {
    const view = render(<ListingViewSeeds listing={null} jurisdiction={jurisdiction} />)
    expect(view.getByText("Page not found")).toBeDefined()
    expect(view.queryByText(listing.name)).toBeNull()
  })

  it("shows listing name if listing is defined", () => {
    const view = render(<ListingViewSeeds listing={listing} jurisdiction={jurisdiction} />)
    expect(view.getByRole("heading", { level: 1 })).toHaveTextContent(listing.name)
  })

  it("renders markdown in what to expect", () => {
    const view = render(
      <ListingViewSeeds
        listing={{
          ...listing,
          whatToExpect: `<div><div className="mb-3">If you are interested in applying for this property, please get in touch in one of these ways:</div><div><ul class="list-disc pl-6"><li>Phone</li><li>Email</li><li>In-person</li><li>In some instances, the property has a link directly to an application</li></ul></div><div className="mt-2">Once you contact a property, ask if they have any available units if you are looking to move in immediately.</div><div className="mt-2"><strong>Waitlists</strong>:<div>If none are available, but you are still interested in eventually living at the property, ask how you can be placed on their waitlist.</div>`,
        }}
        jurisdiction={jurisdiction}
      />
    )
    expect(view.queryByText("<", { exact: false })).toBeNull()
    // There are two instances for Desktop vs Mobile
    expect(
      view.getAllByText("If you are interested in applying for this property", { exact: false })
    ).toHaveLength(2)
  })

  it("does not renders what to expect additional field when feature flag off", () => {
    render(
      <ListingViewSeeds
        listing={{
          ...listing,
          creditHistory: "",
          rentalHistory: "",
          whatToExpect: "Normal What to expect",
          whatToExpectAdditionalText: "What to expect additional text",
        }}
        jurisdiction={{
          ...jurisdiction,
          featureFlags: [],
        }}
      />
    )
    expect(screen.getAllByText("Normal What to expect")).toHaveLength(2)
    expect(screen.queryAllByText("What to expect additional text")).toHaveLength(0)
    expect(screen.queryAllByRole("button", { name: "read more" })).toHaveLength(0)
  })

  it("does not renders read more when whatToExpectAdditionalText does not exist", () => {
    render(
      <ListingViewSeeds
        listing={{
          ...listing,
          creditHistory: "",
          rentalHistory: "",
          whatToExpect: "Normal What to expect",
          whatToExpectAdditionalText: "",
        }}
        jurisdiction={{
          ...jurisdiction,
          featureFlags: [
            {
              name: FeatureFlagEnum.enableWhatToExpectAdditionalField,
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
    expect(screen.getAllByText("Normal What to expect")).toHaveLength(2)
    expect(screen.queryAllByRole("button", { name: "read more" })).toHaveLength(0)
  })

  it("renders what to expect additional field when feature flag on", () => {
    render(
      <ListingViewSeeds
        listing={{
          ...listing,
          // removing other fields that have "read more" button
          creditHistory: "",
          rentalHistory: "",
          whatToExpect: "Normal What to expect",
          whatToExpectAdditionalText: "What to expect additional text",
        }}
        jurisdiction={{
          ...jurisdiction,
          featureFlags: [
            {
              name: FeatureFlagEnum.enableWhatToExpectAdditionalField,
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
    // There are two instances, one for desktop and one for mobile
    expect(screen.getAllByText("Normal What to expect")).toHaveLength(2)
    expect(screen.getAllByRole("button", { name: "read more" })).toHaveLength(2)
    // Additional text doesn't appear until "read more" is clicked
    expect(screen.queryAllByText("What to expect additional text")).toHaveLength(0)

    fireEvent.click(screen.getAllByRole("button", { name: "read more" })[0])
    expect(screen.getByText("What to expect additional text")).toBeInTheDocument()
  })

  it("doesn't show listing updated at for a default jurisdiction", () => {
    const view = render(<ListingViewSeeds listing={listing} jurisdiction={jurisdiction} />)
    expect(view.queryByText("Listing updated: Dec 31, 2019")).toBeNull()
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
    expect(view.getAllByText("Listing updated: Dec 31, 2019")).toHaveLength(2)
  })
})
