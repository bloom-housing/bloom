import React from "react"
import { render, within } from "@testing-library/react"
import { DetailUnits } from "../../../../../src/components/listings/PaperListingDetails/sections/DetailUnits"
import { ListingContext } from "../../../../../src/components/listings/ListingContext"
import { listing } from "../../../../testHelpers"
import { ListingReviewOrder } from "@bloom-housing/backend-core"

describe("DetailUnits", () => {
  it("should render the detail units when no units exist", () => {
    const results = render(
      <ListingContext.Provider
        value={{
          ...listing,
          reviewOrderType: ListingReviewOrder.firstComeFirstServe,
          unitGroups: [],
        }}
      >
        <DetailUnits setUnitDrawer={jest.fn()} />
      </ListingContext.Provider>
    )

    // Above the table
    expect(results.getByText("Listing Units")).toBeInTheDocument()
    expect(results.getByText("Home Type")).toBeInTheDocument()
    expect(results.getByText("Apartment")).toBeInTheDocument()

    // Table
    expect(results.getByText("Unit Groups")).toBeInTheDocument()
    expect(results.getByText("None")).toBeInTheDocument()
  })

  it("should render the detail units", () => {
    const callUnitDrawer = jest.fn()
    const results = render(
      <ListingContext.Provider
        value={{
          ...listing,
          reviewOrderType: ListingReviewOrder.firstComeFirstServe,
          disableUnitsAccordion: true,
        }}
      >
        <DetailUnits setUnitDrawer={callUnitDrawer} />
      </ListingContext.Provider>
    )

    // Above the table
    expect(results.getByText("Listing Units")).toBeInTheDocument()
    expect(results.getByText("Home Type")).toBeInTheDocument()
    expect(results.getByText("Apartment")).toBeInTheDocument()

    // Table
    const table = results.getByRole("table")
    const headAndBody = within(table).getAllByRole("rowgroup")
    expect(headAndBody).toHaveLength(2)
    const [head, body] = headAndBody
    expect(within(head).getAllByRole("columnheader")).toHaveLength(8)
    const rows = within(body).getAllByRole("row")
    expect(rows).toHaveLength(1)
    // Validate first row
    const [type, unitNumber, ami, rent, occupancy, sqft, bath, actions] = within(
      rows[0]
    ).getAllByRole("cell")
    expect(type).toHaveTextContent("1 Bedroom")
    expect(unitNumber).toBeEmptyDOMElement()
    expect(ami).toBeEmptyDOMElement()
    expect(rent).toBeEmptyDOMElement()
    expect(occupancy).toHaveTextContent("1 - 3")
    expect(sqft).toBeEmptyDOMElement()
    expect(bath).toHaveTextContent("1 - 2")
    expect(actions).toBeEmptyDOMElement()
  })
})
