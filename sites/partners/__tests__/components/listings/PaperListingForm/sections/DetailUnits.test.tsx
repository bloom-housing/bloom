import React from "react"
import { fireEvent, render, within } from "@testing-library/react"
import { DetailUnits } from "../../../../../src/components/listings/PaperListingDetails/sections/DetailUnits"
import { ListingContext } from "../../../../../src/components/listings/ListingContext"
import { listing, unit } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { Listing, ListingReviewOrder } from "@bloom-housing/backend-core"

describe("DetailUnits", () => {
  it("should render the detail units when no units exist", () => {
    const results = render(
      <ListingContext.Provider
        value={{
          ...(listing as unknown as Listing),
          reviewOrderType: ListingReviewOrder.waitlist,
          units: [],
        }}
      >
        <DetailUnits setUnitDrawer={jest.fn()} />
      </ListingContext.Provider>
    )

    // Above the table
    expect(results.getByText("Listing Units")).toBeInTheDocument()
    expect(
      results.getByText("Do you want to show unit types or individual units?")
    ).toBeInTheDocument()
    expect(results.getByText("Individual Units")).toBeInTheDocument()
    expect(results.getByText("What is the listing availability?")).toBeInTheDocument()
    expect(results.getByText("Open Waitlist")).toBeInTheDocument()

    // Table
    expect(results.getByText("None")).toBeInTheDocument()
  })

  // Unskip when partner site is connect to new backend
  it.skip("should render the detail units", () => {
    const callUnitDrawer = jest.fn()
    const results = render(
      <ListingContext.Provider
        value={{
          ...(listing as unknown as Listing),
          reviewOrderType: ListingReviewOrder.firstComeFirstServe,
          disableUnitsAccordion: true,
        }}
      >
        <DetailUnits setUnitDrawer={callUnitDrawer} />
      </ListingContext.Provider>
    )

    // Above the table
    expect(results.getByText("Listing Units")).toBeInTheDocument()
    expect(
      results.getByText("Do you want to show unit types or individual units?")
    ).toBeInTheDocument()
    expect(results.getByText("Unit Types")).toBeInTheDocument()
    expect(results.getByText("What is the listing availability?")).toBeInTheDocument()
    expect(results.getByText("Available Units")).toBeInTheDocument()

    // Table
    const table = results.getByRole("table")
    const headAndBody = within(table).getAllByRole("rowgroup")
    expect(headAndBody).toHaveLength(2)
    const [head, body] = headAndBody
    expect(within(head).getAllByRole("columnheader")).toHaveLength(7)
    const rows = within(body).getAllByRole("row")
    expect(rows).toHaveLength(6)
    // Validate first row
    const [unitNumber, type, ami, rent, sqft, ada, action] = within(rows[0]).getAllByRole("cell")
    expect(unitNumber).toBeEmptyDOMElement()
    expect(type).toHaveTextContent("Studio")
    expect(ami).toHaveTextContent(unit.amiPercentage || "")
    expect(rent).toHaveTextContent(unit.monthlyRent || "")
    expect(sqft).toHaveTextContent(unit.sqFeet || "")
    expect(ada).toBeEmptyDOMElement()

    fireEvent.click(within(action).getByText("View"))
    expect(callUnitDrawer).toBeCalledWith(unit)
  })
})
