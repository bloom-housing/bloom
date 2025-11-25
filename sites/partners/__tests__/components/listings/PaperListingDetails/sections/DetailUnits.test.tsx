import React from "react"
import { fireEvent, render, screen, within } from "@testing-library/react"
import { DetailUnits } from "../../../../../src/components/listings/PaperListingDetails/sections/DetailUnits"
import { ListingContext } from "../../../../../src/components/listings/ListingContext"
import { listing, unit } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  EnumListingListingType,
  EnumUnitGroupAmiLevelMonthlyRentDeterminationType,
  FeatureFlagEnum,
  HomeTypeEnum,
  RentTypeEnum,
  ReviewOrderTypeEnum,
  UnitTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AuthContext } from "@bloom-housing/shared-helpers"

function mockJurisdictionsHaveFeatureFlagOn(
  featureFlag: string,
  enableHomeType = true,
  enableSection8Question = true,
  enableUnitGroups = false,
  enableNonRegulatedListings = false
) {
  switch (featureFlag) {
    case FeatureFlagEnum.enableHomeType:
      return enableHomeType
    case FeatureFlagEnum.enableSection8Question:
      return enableSection8Question
    case FeatureFlagEnum.enableUnitGroups:
      return enableUnitGroups
    case FeatureFlagEnum.enableNonRegulatedListings:
      return enableNonRegulatedListings
  }
}

describe("DetailUnits", () => {
  it("should render the detail units when no units exist", () => {
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            mockJurisdictionsHaveFeatureFlagOn(featureFlag, false),
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
    expect(screen.getByRole("heading", { level: 2, name: /listing units/i })).toBeInTheDocument()
    expect(
      screen.getByText("Do you want to show unit types or individual units?")
    ).toBeInTheDocument()
    expect(screen.getByText("Individual units")).toBeInTheDocument()
    expect(screen.getByText("What is the listing availability?")).toBeInTheDocument()
    expect(screen.getByText("Open waitlist")).toBeInTheDocument()
    expect(screen.queryAllByText("Home type")).toHaveLength(0)

    // Table
    expect(screen.getByText("None")).toBeInTheDocument()
  })

  it("should render the detail units", () => {
    const callUnitDrawer = jest.fn()
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            mockJurisdictionsHaveFeatureFlagOn(featureFlag, false, false),
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
    expect(screen.getByRole("heading", { level: 2, name: /listing units/i })).toBeInTheDocument()
    expect(
      screen.getByText("Do you want to show unit types or individual units?")
    ).toBeInTheDocument()
    expect(screen.getByText("Unit types")).toBeInTheDocument()
    expect(screen.getByText("What is the listing availability?")).toBeInTheDocument()
    expect(screen.getByText("Available units")).toBeInTheDocument()

    // Table
    const table = screen.getByRole("table")
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

    fireEvent.click(within(action).getByRole("button", { name: /view/i }))
    expect(callUnitDrawer).toBeCalledWith(unit)
  })

  it("should render the detail units when no unit groups exist", () => {
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            mockJurisdictionsHaveFeatureFlagOn(featureFlag, false, true, false),
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.waitlist,
            units: [],
            unitGroups: [],
          }}
        >
          <DetailUnits setUnitDrawer={jest.fn()} />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    // Above the table
    expect(screen.getByRole("heading", { level: 2, name: /listing units/i })).toBeInTheDocument()
    expect(
      screen.getByText("Do you want to show unit types or individual units?")
    ).toBeInTheDocument()
    expect(screen.getByText("Individual units")).toBeInTheDocument()
    expect(screen.getByText("What is the listing availability?")).toBeInTheDocument()
    expect(screen.getByText("Open waitlist")).toBeInTheDocument()
    expect(screen.queryAllByText("Home type")).toHaveLength(0)

    // Table
    expect(screen.getByText("None")).toBeInTheDocument()
  })

  it("should render the detail units with unit groups for regulated listing", () => {
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            mockJurisdictionsHaveFeatureFlagOn(featureFlag, false, true, true),
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.waitlist,
            units: [],
            unitGroups: [
              {
                id: "caae49d5-028f-4da3-a97b-6a79246816e9",
                createdAt: new Date(2025, 4, 8),
                updatedAt: new Date(2025, 4, 8),
                unitTypes: [
                  {
                    id: "test_id_1",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: UnitTypeEnum.twoBdrm,
                    numBedrooms: 2,
                  },
                  {
                    id: "test_id_1",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: UnitTypeEnum.SRO,
                    numBedrooms: 5,
                  },
                ],
                totalCount: 2,
                minOccupancy: 1,
                maxOccupancy: 4,
                sqFeetMin: 20,
                sqFeetMax: 64,
                bathroomMin: 1,
                bathroomMax: 2,
                unitGroupAmiLevels: [
                  {
                    id: "test_ami_id_1",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    amiPercentage: 25,
                    monthlyRentDeterminationType:
                      EnumUnitGroupAmiLevelMonthlyRentDeterminationType.flatRent,
                    flatRentValue: 1500,
                  },
                  {
                    id: "test_ami_id_2",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    amiPercentage: 25,
                    monthlyRentDeterminationType:
                      EnumUnitGroupAmiLevelMonthlyRentDeterminationType.flatRent,
                    flatRentValue: 2400,
                  },
                  {
                    id: "test_ami_id_3",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    amiPercentage: 30,
                    monthlyRentDeterminationType:
                      EnumUnitGroupAmiLevelMonthlyRentDeterminationType.percentageOfIncome,
                    percentageOfIncomeValue: 10,
                  },
                  {
                    id: "test_ami_id_4",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    amiPercentage: 30,
                    monthlyRentDeterminationType:
                      EnumUnitGroupAmiLevelMonthlyRentDeterminationType.percentageOfIncome,
                    percentageOfIncomeValue: 20,
                  },
                ],
              },
            ],
          }}
        >
          <DetailUnits setUnitDrawer={jest.fn()} />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    // Above the table
    expect(screen.getByRole("heading", { level: 2, name: /listing units/i })).toBeInTheDocument()
    expect(
      screen.queryByText("Do you want to show unit types or individual units?")
    ).not.toBeInTheDocument()
    expect(screen.queryByText("Individual units")).not.toBeInTheDocument()
    expect(screen.queryByText("What is the listing availability?")).not.toBeInTheDocument()
    expect(screen.queryByText("Open waitlist")).not.toBeInTheDocument()
    expect(screen.queryAllByText("Home type")).toHaveLength(0)

    // Table
    const table = screen.getByRole("table")
    const headAndBody = within(table).getAllByRole("rowgroup")
    expect(headAndBody).toHaveLength(2)
    const [head, body] = headAndBody

    const columnHeaders = within(head).getAllByRole("columnheader")
    expect(columnHeaders).toHaveLength(7)

    expect(columnHeaders[0]).toHaveTextContent("Unit type")
    expect(columnHeaders[1]).toHaveTextContent("# of units")
    expect(columnHeaders[2]).toHaveTextContent("AMI")
    expect(columnHeaders[3]).toHaveTextContent("Rent")
    expect(columnHeaders[4]).toHaveTextContent("Occupancy")
    expect(columnHeaders[5]).toHaveTextContent("SQ FT")
    expect(columnHeaders[6]).toHaveTextContent("Bath")

    const rows = within(body).getAllByRole("row")
    expect(rows).toHaveLength(1)
    // Validate first row
    const [unitType, unitsNumber, ami, rent, occupancy, sqFeet, bath] = within(
      rows[0]
    ).getAllByRole("cell")

    expect(unitType).toHaveTextContent("2 BR, SRO")
    expect(unitsNumber).toHaveTextContent("2")
    expect(ami).toHaveTextContent("25% - 30%")
    expect(rent).toHaveTextContent("1500 - 2400, 10% - 20%")
    expect(occupancy).toHaveTextContent("1 - 4")
    expect(sqFeet).toHaveTextContent("20 - 64")
    expect(bath).toHaveTextContent("1 - 2")
  })

  it("should render the detail units with unit groups for non-regulated listing", () => {
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            mockJurisdictionsHaveFeatureFlagOn(featureFlag, false, true, true, true),
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            listingType: EnumListingListingType.nonRegulated,
            reviewOrderType: ReviewOrderTypeEnum.waitlist,
            units: [],
            unitGroups: [
              {
                id: "test_unit_group_id_1",
                createdAt: new Date(2025, 4, 8),
                updatedAt: new Date(2025, 4, 8),
                rentType: RentTypeEnum.fixedRent,
                monthlyRent: 2000,
                unitTypes: [
                  {
                    id: "test_id_1",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: UnitTypeEnum.twoBdrm,
                    numBedrooms: 2,
                  },
                  {
                    id: "test_id_2",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: UnitTypeEnum.SRO,
                    numBedrooms: 5,
                  },
                ],
                totalCount: 2,
                minOccupancy: 1,
                maxOccupancy: 4,
                bathroomMin: 1,
                bathroomMax: 2,
              },
              {
                id: "test_unit_group_id_2",
                createdAt: new Date(2025, 4, 8),
                updatedAt: new Date(2025, 4, 8),
                rentType: RentTypeEnum.rentRange,
                flatRentValueFrom: 1250,
                flatRentValueTo: 1750,
                unitTypes: [
                  {
                    id: "test_id_3",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: UnitTypeEnum.fourBdrm,
                    numBedrooms: 2,
                  },
                ],
                totalCount: 1,
                minOccupancy: 2,
                maxOccupancy: 5,
                bathroomMin: 2,
                bathroomMax: 2,
              },
            ],
          }}
        >
          <DetailUnits setUnitDrawer={jest.fn()} />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    // Above the table
    expect(screen.getByRole("heading", { level: 2, name: /listing units/i })).toBeInTheDocument()
    expect(
      screen.queryByText("Do you want to show unit types or individual units?")
    ).not.toBeInTheDocument()
    expect(screen.queryByText("Individual units")).not.toBeInTheDocument()
    expect(screen.queryByText("What is the listing availability?")).not.toBeInTheDocument()
    expect(screen.queryByText("Open waitlist")).not.toBeInTheDocument()
    expect(screen.queryAllByText("Home type")).toHaveLength(0)

    // Table
    const table = screen.getByRole("table")
    const headAndBody = within(table).getAllByRole("rowgroup")
    expect(headAndBody).toHaveLength(2)
    const [head, body] = headAndBody

    const columnHeaders = within(head).getAllByRole("columnheader")
    expect(columnHeaders).toHaveLength(5)

    expect(columnHeaders[0]).toHaveTextContent("Unit type")
    expect(columnHeaders[1]).toHaveTextContent("# of units")
    expect(columnHeaders[2]).toHaveTextContent("Rent")
    expect(columnHeaders[3]).toHaveTextContent("Occupancy")
    expect(columnHeaders[4]).toHaveTextContent("Bath")

    const rows = within(body).getAllByRole("row")
    expect(rows).toHaveLength(2)
    // Validate first row
    const [firstUnitType, firstUnitsNumber, firstRent, firstOccupancy, firstBath] = within(
      rows[0]
    ).getAllByRole("cell")

    expect(firstUnitType).toHaveTextContent("2 BR, SRO")
    expect(firstUnitsNumber).toHaveTextContent("2")
    expect(firstRent).toHaveTextContent("2000")
    expect(firstOccupancy).toHaveTextContent("1 - 4")
    expect(firstBath).toHaveTextContent("1 - 2")

    const [secondUnitType, secondUnitsNumber, secondRent, secondOccupancy, secondBath] = within(
      rows[1]
    ).getAllByRole("cell")

    expect(secondUnitType).toHaveTextContent("4 BR")
    expect(secondUnitsNumber).toHaveTextContent("1")
    expect(secondRent).toHaveTextContent("1250 - 1750")
    expect(secondOccupancy).toHaveTextContent("2 - 5")
    expect(secondBath).toHaveTextContent("2")
  })

  describe("Listing availability text", () => {
    it("should render 'Open waitlist' for waitlistLottery review order type", () => {
      render(
        <AuthContext.Provider
          value={{
            doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
              mockJurisdictionsHaveFeatureFlagOn(featureFlag, false),
          }}
        >
          <ListingContext.Provider
            value={{
              ...listing,
              reviewOrderType: ReviewOrderTypeEnum.waitlistLottery,
              units: [],
            }}
          >
            <DetailUnits setUnitDrawer={jest.fn()} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )

      expect(screen.getByText("What is the listing availability?")).toBeInTheDocument()
      expect(screen.getByText("Open waitlist")).toBeInTheDocument()
    })

    it("should render 'Available units' for lottery review order type", () => {
      render(
        <AuthContext.Provider
          value={{
            doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
              mockJurisdictionsHaveFeatureFlagOn(featureFlag, false),
          }}
        >
          <ListingContext.Provider
            value={{
              ...listing,
              reviewOrderType: ReviewOrderTypeEnum.lottery,
              disableUnitsAccordion: true,
            }}
          >
            <DetailUnits setUnitDrawer={jest.fn()} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )

      expect(screen.getByText("What is the listing availability?")).toBeInTheDocument()
      expect(screen.getByText("Available units")).toBeInTheDocument()
    })
  })

  describe("Home type", () => {
    it("should render the home type if enabled", () => {
      const callUnitDrawer = jest.fn()
      render(
        <AuthContext.Provider
          value={{
            doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
              mockJurisdictionsHaveFeatureFlagOn(featureFlag),
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

      expect(screen.getByRole("heading", { level: 2, name: /listing units/i })).toBeInTheDocument()
      expect(screen.getByText("Home type")).toBeInTheDocument()
      expect(screen.getByText("Apartment")).toBeInTheDocument()
    })
    it("should render 'none' home type if enabled and no home type set", () => {
      const callUnitDrawer = jest.fn()
      render(
        <AuthContext.Provider
          value={{
            doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
              mockJurisdictionsHaveFeatureFlagOn(featureFlag),
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

      expect(screen.getByRole("heading", { level: 2, name: /listing units/i })).toBeInTheDocument()
      expect(screen.getByText("Home type")).toBeInTheDocument()
      expect(screen.getByText("None")).toBeInTheDocument()
    })
  })
})
