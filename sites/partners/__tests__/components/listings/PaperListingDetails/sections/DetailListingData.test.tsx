import React from "react"
import { render, screen } from "@testing-library/react"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { ReviewOrderTypeEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ListingContext } from "../../../../../src/components/listings/ListingContext"
import DetailListingData from "../../../../../src/components/listings/PaperListingDetails/sections/DetailListingData"

describe("DetailListingData", () => {
  it("should render all data", () => {
    render(
      <ListingContext.Provider
        value={{
          ...listing,
          createdAt: new Date("2023-01-01T10:00:00Z"),
          jurisdictions: { name: "Bloomington", id: "1" },
          id: "1234",
          reviewOrderType: ReviewOrderTypeEnum.waitlist,
          units: [],
        }}
      >
        <DetailListingData showJurisdictionName={true} />
      </ListingContext.Provider>
    )
    expect(screen.getByRole("heading", { level: 2, name: "Listing data" })).toBeInTheDocument()
    expect(screen.getByText("Date created")).toBeInTheDocument()
    expect(screen.getByText("01/01/2023 at 10:00 AM")).toBeInTheDocument()
    expect(screen.getByText("Jurisdiction")).toBeInTheDocument()
    expect(screen.getByText("Bloomington")).toBeInTheDocument()
    expect(screen.getByText("Listing ID")).toBeInTheDocument()
    expect(screen.getByText("1234")).toBeInTheDocument()
  })

  it("should hide jurisdiction", () => {
    render(
      <ListingContext.Provider
        value={{
          ...listing,
          createdAt: new Date("2023-01-01T10:00:00Z"),
          jurisdictions: { name: "Bloomington", id: "1" },
          id: "1234",
          reviewOrderType: ReviewOrderTypeEnum.waitlist,
          units: [],
        }}
      >
        <DetailListingData showJurisdictionName={false} />
      </ListingContext.Provider>
    )
    expect(screen.getByRole("heading", { level: 2, name: "Listing data" })).toBeInTheDocument()
    expect(screen.getByText("Date created")).toBeInTheDocument()
    expect(screen.getByText("01/01/2023 at 10:00 AM")).toBeInTheDocument()
    expect(screen.queryByText("Jurisdiction")).not.toBeInTheDocument()
    expect(screen.queryByText("Bloomington")).not.toBeInTheDocument()
    expect(screen.getByText("Listing ID")).toBeInTheDocument()
    expect(screen.getByText("1234")).toBeInTheDocument()
  })
})
