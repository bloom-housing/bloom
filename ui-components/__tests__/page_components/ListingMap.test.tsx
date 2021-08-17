import React from "react"
import { render, cleanup } from "@testing-library/react"
import { ListingMap } from "../../src/page_components/listing/ListingMap"
import Archer from "../fixtures/archer.json"

afterEach(cleanup)

describe("<ListingMap>", () => {
  it("renders without error", () => {
    const listing = Object.assign({}, Archer) as any
    const { getByText } = render(
      <ListingMap address={listing.buildingAddress} listingName={listing.name} />
    )
    expect(getByText(listing.name)).toBeTruthy()
    expect(getByText(listing.buildingAddress.street, { exact: false })).toBeTruthy()
  })
})
