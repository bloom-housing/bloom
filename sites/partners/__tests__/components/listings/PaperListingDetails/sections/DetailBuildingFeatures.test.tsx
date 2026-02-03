import React from "react"
import { render, screen, within } from "@testing-library/react"
import DetailBuildingFeatures from "../../../../../src/components/listings/PaperListingDetails/sections/DetailBuildingFeatures"
import { ListingContext } from "../../../../../src/components/listings/ListingContext"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

describe("DetailBuildingFeatures", () => {
  it("should render details correctly with flags off", () => {
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: () => false,
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            amenities: "Property amenities text",
            accessibility: "Additional accessibility text",
            unitAmenities: "Unit amenities text",
            petPolicy: "Pets policy text",
            servicesOffered: "Services offered text",
            smokingPolicy: "Smoking policy text",
          }}
        >
          <DetailBuildingFeatures />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    expect(screen.getByText("Property amenities")).toBeInTheDocument()
    expect(screen.getByText("Property amenities text")).toBeInTheDocument()

    expect(screen.getByText("Additional accessibility")).toBeInTheDocument()
    expect(screen.getByText("Additional accessibility text")).toBeInTheDocument()

    expect(screen.getByText("Unit amenities")).toBeInTheDocument()
    expect(screen.getByText("Unit amenities text")).toBeInTheDocument()

    expect(screen.getByText("Pets policy")).toBeInTheDocument()
    expect(screen.getByText("Pets policy text")).toBeInTheDocument()

    expect(screen.getByText("Services offered")).toBeInTheDocument()
    expect(screen.getByText("Services offered text")).toBeInTheDocument()

    expect(screen.getByText("Smoking policy")).toBeInTheDocument()
    expect(screen.getByText("Smoking policy text")).toBeInTheDocument()

    expect(screen.queryByText("Allows dogs")).not.toBeInTheDocument()
    expect(screen.queryByText("Allows cats")).not.toBeInTheDocument()
  })

  it("should render pet policy list when enablePetPolicyCheckbox is true", () => {
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (flag) =>
            flag === FeatureFlagEnum.enablePetPolicyCheckbox,
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            allowsDogs: true,
            allowsCats: true,
          }}
        >
          <DetailBuildingFeatures />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    expect(screen.getByText("Pets policy")).toBeInTheDocument()
    expect(screen.queryByText("Pets policy text")).not.toBeInTheDocument()

    const list = screen.getByTestId("pet-policy-list")
    const listItems = within(list).getAllByRole("listitem")
    expect(listItems[0]).toHaveTextContent("Allows dogs")
    expect(listItems[1]).toHaveTextContent("Allows cats")
  })

  it("should render full parking types list when enableParkingTypes feature flag is true", () => {
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (flag) => flag === FeatureFlagEnum.enableParkingType,
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            parkingTypes: {
              id: "testId",
              createdAt: new Date(),
              updatedAt: new Date(),
              onStreet: true,
              offStreet: true,
              garage: true,
              carport: true,
            },
          }}
        >
          <DetailBuildingFeatures />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    expect(screen.getByText("Parking Types")).toBeInTheDocument()
    const list = screen.getByTestId("parking-types-list")
    const listItems = within(list).getAllByRole("listitem")
    expect(listItems[0]).toHaveTextContent("On Street")
    expect(listItems[1]).toHaveTextContent("Off Street")
    expect(listItems[2]).toHaveTextContent("Garage")
    expect(listItems[3]).toHaveTextContent("Carport")
  })

  it("should render None for parking types list when enableParkingTypes feature flag is true and no parking types are set", () => {
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (flag) => flag === FeatureFlagEnum.enableParkingType,
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            parkingTypes: {
              id: "testId",
              createdAt: new Date(),
              updatedAt: new Date(),
              onStreet: false,
              offStreet: false,
              garage: false,
              carport: false,
            },
          }}
        >
          <DetailBuildingFeatures />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    const parkingTypesSectionHeader = screen.getByText("Parking Types")
    expect(parkingTypesSectionHeader).toBeInTheDocument()
    expect(within(parkingTypesSectionHeader.parentElement).getByText("None")).toBeInTheDocument()
    expect(screen.queryByTestId("parking-types-list")).not.toBeInTheDocument()
    expect(
      within(parkingTypesSectionHeader.parentElement).queryByText("On Street")
    ).not.toBeInTheDocument()
    expect(
      within(parkingTypesSectionHeader.parentElement).queryByText("Off Street")
    ).not.toBeInTheDocument()
    expect(
      within(parkingTypesSectionHeader.parentElement).queryByText("Garage")
    ).not.toBeInTheDocument()
    expect(
      within(parkingTypesSectionHeader.parentElement).queryByText("Carport")
    ).not.toBeInTheDocument()
  })
})
