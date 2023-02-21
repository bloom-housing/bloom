import React from "react"
import { Listing, UnitsSummarized, Jurisdiction, Unit } from "@bloom-housing/backend-core/types"
import { render, cleanup } from "@testing-library/react"
import { ListingView } from "../../../src/components/listing/ListingView"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"

//backend/core/types/src/archer-listing.ts may be useful
afterEach(cleanup)

describe("<ListingView>", () => {
  it("liann tests", () => {
    const { getByText } = render(<ListingView listing={listing} jurisdiction={jurisdiction} />)

    expect(true).toBeTruthy()
  })
})
