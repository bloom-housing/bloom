import React from "react"
import { render, cleanup } from "@testing-library/react"
import { ContactAddress } from "../../src/page_components/listing/listing_sidebar/ContactAddress"
import { ArcherListing } from "@bloom-housing/backend-core/types/src/archer-listing"

afterEach(cleanup)

describe("<ContactAddress>", () => {
  it("renders with address", () => {
    const { getByText } = render(
      <ContactAddress address={ArcherListing.buildingAddress} mapString={"Get Directions"} />
    )
    expect(getByText(ArcherListing.buildingAddress?.street || "", { exact: false })).toBeTruthy()
    expect(getByText("Get Directions")).toBeTruthy()
  })
  it("renders with no address", () => {
    const { queryByText } = render(<ContactAddress />)
    expect(queryByText("Get Directions")).toBeNull()
  })
})
