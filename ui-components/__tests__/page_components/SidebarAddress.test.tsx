import React from "react"
import { render, cleanup } from "@testing-library/react"
import { SidebarAddress } from "../../src/page_components/listing/listing_sidebar/SidebarAddress"
import { ArcherListing } from "@bloom-housing/backend-core/types/src/archer-listing"
import moment from "moment"

afterEach(cleanup)

describe("<SidebarAddress>", () => {
  it("renders with address", () => {
    const { getByText } = render(<SidebarAddress address={ArcherListing.applicationAddress} />)
    expect(getByText(ArcherListing.applicationAddress.street || "", { exact: false })).toBeTruthy()
    expect(getByText("Get Directions")).toBeTruthy()
  })
  it("renders with office hours and no address", () => {
    const { getByText, queryByText } = render(
      <SidebarAddress
        address={{
          id: "abcd1234",
          createdAt: new Date(moment().format()),
          updatedAt: new Date(moment().format()),
        }}
        officeHours={"These are my office hours"}
      />
    )
    expect(queryByText("Get Directions")).toBeNull()
    expect(getByText("These are my office hours")).toBeTruthy()
  })
})
