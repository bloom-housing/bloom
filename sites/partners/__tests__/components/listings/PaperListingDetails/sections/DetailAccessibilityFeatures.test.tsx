import React from "react"
import { render, screen, within } from "@testing-library/react"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  defaultListingFeaturesConfiguration,
  expandedListingFeaturesConfiguration,
  listing,
} from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ListingContext } from "../../../../../src/components/listings/ListingContext"
import DetailAccessibilityFeatures from "../../../../../src/components/listings/PaperListingDetails/sections/DetailAccessibilityFeatures"

describe("DetailAccessibilityFeatures", () => {
  it("renders nothing if neither flag is on", () => {
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: () => false,
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            listingFeatures: {
              elevator: true,
              wheelchairRamp: true,
              accessibleParking: true,
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          }}
        >
          <DetailAccessibilityFeatures
            listingFeaturesConfiguration={defaultListingFeaturesConfiguration}
          />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    expect(
      screen.queryByRole("heading", { level: 2, name: "Accessibility features" })
    ).not.toBeInTheDocument()
  })
  it("renders accessibility features list", () => {
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (flag) =>
            flag === FeatureFlagEnum.enableAccessibilityFeatures,
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            listingFeatures: {
              elevator: true,
              wheelchairRamp: true,
              accessibleParking: true,
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          }}
        >
          <DetailAccessibilityFeatures
            listingFeaturesConfiguration={defaultListingFeaturesConfiguration}
          />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    expect(
      screen.getByRole("heading", { level: 2, name: "Accessibility features" })
    ).toBeInTheDocument()

    const list = screen.getByTestId("accessibility-features-list")
    const listItems = within(list).getAllByRole("listitem")
    expect(listItems[0]).toHaveTextContent("Accessible parking")
    expect(listItems[1]).toHaveTextContent("Elevator")
    expect(listItems[2]).toHaveTextContent("Wheelchair ramp")
  })
  it("renders expanded accessibility features list with items in each category", () => {
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (flag) =>
            flag === FeatureFlagEnum.enableAccessibilityFeatures,
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            listingFeatures: {
              elevator: true,
              wheelchairRamp: true,
              accessibleParking: true,
              walkInShower: true,
              turningCircleInBathrooms: true,
              accessibleHeightToilet: true,
              carpetInUnit: true,
              acInUnit: true,
              leverHandlesOnFaucets: true,
              laundryInBuilding: true,
              brailleSignageInBuilding: true,
              nonDigitalKitchenAppliances: true,
              extraAudibleCarbonMonoxideDetector: true,
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          }}
        >
          <DetailAccessibilityFeatures
            listingFeaturesConfiguration={expandedListingFeaturesConfiguration}
          />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    expect(
      screen.getByRole("heading", { level: 2, name: "Accessibility features" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 3, name: "Accessibility features summary" })
    ).toBeInTheDocument()

    const mobilityList = screen.getByTestId("accessibility-features-mobility")
    expect(
      within(mobilityList).getByRole("heading", { level: 4, name: "Mobility" })
    ).toBeInTheDocument()
    const mobilityListItems = within(mobilityList).getAllByRole("listitem")
    expect(mobilityListItems).toHaveLength(3)
    expect(mobilityListItems[2]).toHaveTextContent("Accessible parking")
    expect(mobilityListItems[0]).toHaveTextContent("Elevator")
    expect(mobilityListItems[1]).toHaveTextContent("Wheelchair ramp")

    const bathroomList = screen.getByTestId("accessibility-features-bathroom")
    expect(
      within(bathroomList).getByRole("heading", { level: 4, name: "Bathroom" })
    ).toBeInTheDocument()
    const bathroomListItems = within(bathroomList).getAllByRole("listitem")
    expect(bathroomListItems).toHaveLength(3)
    expect(bathroomListItems[0]).toHaveTextContent("Walk-in shower")
    expect(bathroomListItems[1]).toHaveTextContent("Turning circle in bathrooms")
    expect(bathroomListItems[2]).toHaveTextContent("Accessible height toilet")

    const flooringList = screen.getByTestId("accessibility-features-flooring")
    expect(
      within(flooringList).getByRole("heading", { level: 4, name: "Flooring" })
    ).toBeInTheDocument()
    const flooringListItems = within(flooringList).getAllByRole("listitem")
    expect(flooringListItems).toHaveLength(1)
    expect(flooringListItems[0]).toHaveTextContent("Carpet in unit")

    const utilityList = screen.getByTestId("accessibility-features-utility")
    expect(
      within(utilityList).getByRole("heading", { level: 4, name: "Utility" })
    ).toBeInTheDocument()
    const utilityListItems = within(utilityList).getAllByRole("listitem")
    expect(utilityListItems).toHaveLength(3)
    expect(utilityListItems[0]).toHaveTextContent("AC in unit")
    expect(utilityListItems[1]).toHaveTextContent("Lever handles on faucets")
    expect(utilityListItems[2]).toHaveTextContent("Laundry in building")

    const hearingVisionList = screen.getByTestId("accessibility-features-hearingVision")
    expect(
      within(hearingVisionList).getByRole("heading", { level: 4, name: "Hearing / Vision" })
    ).toBeInTheDocument()
    const hearingVisionListItems = within(hearingVisionList).getAllByRole("listitem")
    expect(hearingVisionListItems).toHaveLength(3)
    expect(hearingVisionListItems[0]).toHaveTextContent("Braille signage in building")
    expect(hearingVisionListItems[1]).toHaveTextContent("Non-digital kitchen appliances")
    expect(hearingVisionListItems[2]).toHaveTextContent(
      "Extra audible carbon monoxide detector - min. 85 db"
    )
  })
  it.only("renders expanded accessibility features list with empty categories", async () => {
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (flag) =>
            flag === FeatureFlagEnum.enableAccessibilityFeatures,
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            listingFeatures: {
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          }}
        >
          <DetailAccessibilityFeatures
            listingFeaturesConfiguration={expandedListingFeaturesConfiguration}
          />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    expect(
      screen.getByRole("heading", { level: 2, name: "Accessibility features" })
    ).toBeInTheDocument()
    expect(
      await screen.findByRole("heading", { level: 3, name: "Accessibility features summary" })
    ).toBeInTheDocument()

    const mobilityList = screen.getByTestId("accessibility-features-mobility")
    expect(
      within(mobilityList).getByRole("heading", { level: 4, name: "Mobility" })
    ).toBeInTheDocument()
    const mobilityListItems = within(mobilityList).queryAllByRole("listitem")
    expect(mobilityListItems).toHaveLength(0)
    expect(within(mobilityList).getByText("None")).toBeInTheDocument()

    const bathroomList = screen.getByTestId("accessibility-features-bathroom")
    expect(
      within(bathroomList).getByRole("heading", { level: 4, name: "Bathroom" })
    ).toBeInTheDocument()
    const bathroomListItems = within(bathroomList).queryAllByRole("listitem")
    expect(bathroomListItems).toHaveLength(0)
    expect(within(bathroomList).getByText("None")).toBeInTheDocument()

    const flooringList = screen.getByTestId("accessibility-features-flooring")
    expect(
      within(flooringList).getByRole("heading", { level: 4, name: "Flooring" })
    ).toBeInTheDocument()
    const flooringListItems = within(flooringList).queryAllByRole("listitem")
    expect(flooringListItems).toHaveLength(0)
    expect(within(flooringList).getByText("None")).toBeInTheDocument()

    const utilityList = screen.getByTestId("accessibility-features-utility")
    expect(
      within(utilityList).getByRole("heading", { level: 4, name: "Utility" })
    ).toBeInTheDocument()
    const utilityListItems = within(utilityList).queryAllByRole("listitem")
    expect(utilityListItems).toHaveLength(0)
    expect(within(utilityList).getByText("None")).toBeInTheDocument()

    const hearingVisionList = screen.getByTestId("accessibility-features-hearingVision")
    expect(
      within(hearingVisionList).getByRole("heading", { level: 4, name: "Hearing / Vision" })
    ).toBeInTheDocument()
    const hearingVisionListItems = within(hearingVisionList).queryAllByRole("listitem")
    expect(hearingVisionListItems).toHaveLength(0)
    expect(within(hearingVisionList).getByText("None")).toBeInTheDocument()
  })
})
