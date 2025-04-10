import React from "react"
import { fireEvent, render, within } from "@testing-library/react"
import { DetailUnits } from "../../../../../src/components/listings/PaperListingDetails/sections/DetailUnits"
import { ListingContext } from "../../../../../src/components/listings/ListingContext"
import { listing, unit } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  HomeTypeEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AuthContext } from "@bloom-housing/shared-helpers"

describe("DetailUnits", () => {
  it("should render the detail units when no units exist", () => {
    const results = render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: () => {
            return false
          },
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.waitlist,
            units: [],
          }}
        >
          <DetailUnits setUnitDrawer={jest.fn()} />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    // Above the table
    expect(results.getByText("Listing Units")).toBeInTheDocument()
    expect(
      results.getByText("Do you want to show unit types or individual units?")
    ).toBeInTheDocument()
    expect(results.getByText("Individual Units")).toBeInTheDocument()
    expect(results.getByText("What is the listing availability?")).toBeInTheDocument()
    expect(results.getByText("Open Waitlist")).toBeInTheDocument()
    expect(results.queryAllByText("Home Type")).toHaveLength(0)

    // Table
    expect(results.getByText("None")).toBeInTheDocument()
  })

  it("should render the detail units", () => {
    const callUnitDrawer = jest.fn()
    const results = render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: () => {
            return false
          },
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
            disableUnitsAccordion: true,
          }}
        >
          <DetailUnits setUnitDrawer={callUnitDrawer} />
        </ListingContext.Provider>
      </AuthContext.Provider>
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

  describe("Home Type", () => {
    it("should render the home type if enabled", () => {
      const callUnitDrawer = jest.fn()
      const results = render(
        <AuthContext.Provider
          value={{
            doJurisdictionsHaveFeatureFlagOn: () => {
              return true
            },
          }}
        >
          <ListingContext.Provider
            value={{
              ...listing,
              reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
              disableUnitsAccordion: true,
              homeType: HomeTypeEnum.apartment,
            }}
          >
            <DetailUnits setUnitDrawer={callUnitDrawer} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )

      expect(results.getByText("Listing Units")).toBeInTheDocument()
      expect(results.getByText("Home Type")).toBeInTheDocument()
      expect(results.getByText("Apartment")).toBeInTheDocument()
    })
    it("should render 'none' home type if enabled and no home type set", () => {
      const callUnitDrawer = jest.fn()
      const results = render(
        <AuthContext.Provider
          value={{
            doJurisdictionsHaveFeatureFlagOn: () => {
              return true
            },
          }}
        >
          <ListingContext.Provider
            value={{
              ...listing,
              reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
              disableUnitsAccordion: true,
            }}
          >
            <DetailUnits setUnitDrawer={callUnitDrawer} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )

      expect(results.getByText("Listing Units")).toBeInTheDocument()
      expect(results.getByText("Home Type")).toBeInTheDocument()
      expect(results.getByText("None")).toBeInTheDocument()
    })
  })
})
