import React from "react"
import { render, cleanup } from "@testing-library/react"
import { ApplicationSection } from "../../src/page_components/listing/listing_sidebar/ApplicationSection"
import { ArcherListing } from "@bloom-housing/backend-core/types/src/archer-listing"
import { Listing } from "@bloom-housing/backend-core/types"
import moment from "moment"

afterEach(cleanup)

describe("<ApplicationSection>", () => {
  it("renders in default state", () => {
    const listing = Object.assign({}, ArcherListing) as Listing
    const days = 10
    listing.applicationOpenDate = new Date(moment().format())
    listing.waitlistCurrentSize = 0
    listing.applicationDueDate = new Date(moment().add(days, "days").format())
    const { getByText, getAllByText } = render(
      <ApplicationSection listing={listing} internalFormRoute="/forms" />
    )
    expect(getByText(listing.waitlistMaxSize)).toBeTruthy()
    expect(getAllByText(listing.applicationAddress.street).length).toBe(4)
    expect(getAllByText(listing.leasingAgentOfficeHours).length).toBe(2)
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
    expect(queryByText(listing.waitlistMaxSize)).toBeNull()
    expect(queryByText(listing.applicationAddress.street)).toBeNull()
  })
})
