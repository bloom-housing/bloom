import React from "react"
import { render, cleanup } from "@testing-library/react"
import { ApplicationSection } from "../../src/page_components/listing/listing_sidebar/ApplicationSection"
import { ArcherListing } from "@bloom-housing/backend-core/types/src/archer-listing"
import {
  previewState,
  previewStateExternalLink,
} from "../../src/page_components/listing/listing_sidebar/ApplicationSection.stories"

import { Listing } from "@bloom-housing/backend-core/types"
import moment from "moment"

afterEach(cleanup)

describe("<ApplicationSection>", () => {
  it("renders in default state", () => {
    const listing = Object.assign({}, ArcherListing) as Listing
    const days = 10
    listing.applicationOpenDate = new Date(moment().format())
    listing.waitlistCurrentSize = 25
    listing.isWaitlistOpen = true
    listing.waitlistMaxSize = 100
    listing.waitlistOpenSpots = 75
    listing.applicationDueDate = new Date(moment().add(days, "days").format())
    listing.applicationPickUpAddress = {
      id: "id",
      createdAt: new Date(),
      updatedAt: new Date(),
      city: "San Jose",
      street: "98 Archer Street",
      zipCode: "95112",
      state: "CA",
      latitude: 37.36537,
      longitude: -121.91071,
    }
    listing.applicationPickUpAddressOfficeHours = "Monday, Tuesday & Friday, 9:00AM - 5:00PM"
    const { getByText, getAllByText } = render(
      <ApplicationSection listing={listing} internalFormRoute="/forms" />
    )
    expect(getByText(listing.waitlistMaxSize)).toBeTruthy()
    expect(getAllByText(listing.applicationAddress?.street || "").length).toBe(1)
    expect(getAllByText(listing.applicationPickUpAddressOfficeHours).length).toBe(1)
  })
  it("renders nothing if applications are closed", () => {
    const listing = Object.assign({}, ArcherListing) as Listing
    const days = 10
    listing.applicationOpenDate = new Date(moment().format())
    listing.waitlistCurrentSize = 0
    listing.applicationDueDate = new Date(moment().subtract(days, "days").format())
    const { queryByText } = render(
      <ApplicationSection listing={listing} internalFormRoute="/forms" />
    )
    expect(listing.waitlistMaxSize && queryByText(listing.waitlistMaxSize)).toBeNull()
    expect(queryByText(listing.applicationAddress?.street || "")).toBeNull()
  })
  it("renders a preview state with disabled external link", () => {
    const { getByText } = render(previewStateExternalLink())
    expect(getByText("Apply Online").closest("button")?.disabled).toBe(true)
  })
  it("renders a preview state with disabled download button", () => {
    const { getByText } = render(previewState())
    expect(getByText("Download Application").closest("button")?.disabled).toBe(true)
  })
})
