import React from "react"
import { render, screen } from "@testing-library/react"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  FeatureFlagEnum,
  Jurisdiction,
  ListingNeighborhoodAmenities,
  NeighborhoodAmenitiesEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ListingContext } from "../../../../../src/components/listings/ListingContext"
import DetailNeighborhoodAmenities from "../../../../../src/components/listings/PaperListingDetails/sections/DetailNeighborhoodAmenities"

import * as hooks from "../../../../../src/lib/hooks"

jest.mock("../../../../../src/lib/hooks")

const mockUseJurisdiction = hooks.useJurisdiction as jest.MockedFunction<
  typeof hooks.useJurisdiction
>

type mockUseJurisdictionReturnValue = {
  data: Jurisdiction
  loading: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
}

describe("DetailNeighborhoodAmenities", () => {
  beforeEach(() => {
    mockUseJurisdiction.mockReturnValue({
      data: {
        visibleNeighborhoodAmenities: [
          NeighborhoodAmenitiesEnum.groceryStores,
          NeighborhoodAmenitiesEnum.publicTransportation,
          NeighborhoodAmenitiesEnum.schools,
        ],
      },
    } as mockUseJurisdictionReturnValue)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should not render when enableNeighborhoodAmenities feature flag is off", () => {
    const { container } = render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: () => false,
        }}
      >
        <ListingContext.Provider value={{ ...listing }}>
          <DetailNeighborhoodAmenities />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("should not render when no visible amenities are configured, even if data exists", () => {
    mockUseJurisdiction.mockReturnValue({
      data: {
        visibleNeighborhoodAmenities: [],
      },
    } as mockUseJurisdictionReturnValue)

    const { container } = render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (flag) =>
            flag === FeatureFlagEnum.enableNeighborhoodAmenities,
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            listingNeighborhoodAmenities: {
              groceryStores: "0.5 miles",
              publicTransportation: "2 blocks",
              schools: "1 mile",
            } as ListingNeighborhoodAmenities,
          }}
        >
          <DetailNeighborhoodAmenities />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("should render visible amenities with their values", () => {
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (flag) =>
            flag === FeatureFlagEnum.enableNeighborhoodAmenities,
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            listingNeighborhoodAmenities: {
              groceryStores: "0.5 miles",
              publicTransportation: "2 blocks",
              schools: "1 mile",
            } as ListingNeighborhoodAmenities,
          }}
        >
          <DetailNeighborhoodAmenities />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    expect(screen.getByText("Neighborhood amenities")).toBeInTheDocument()
    expect(screen.getByText("Grocery stores")).toBeInTheDocument()
    expect(screen.getByText("0.5 miles")).toBeInTheDocument()
    expect(screen.getByText("Public transportation")).toBeInTheDocument()
    expect(screen.getByText("2 blocks")).toBeInTheDocument()
    expect(screen.getByText("Schools")).toBeInTheDocument()
    expect(screen.getByText("1 mile")).toBeInTheDocument()
  })

  it("should render 'None' for amenities without values", () => {
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (flag) =>
            flag === FeatureFlagEnum.enableNeighborhoodAmenities,
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            listingNeighborhoodAmenities: {
              groceryStores: "0.5 miles",
              publicTransportation: "",
              schools: null,
            } as ListingNeighborhoodAmenities,
          }}
        >
          <DetailNeighborhoodAmenities />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    expect(screen.getByText("Grocery stores")).toBeInTheDocument()
    expect(screen.getByText("0.5 miles")).toBeInTheDocument()
    expect(screen.getByText("Public transportation")).toBeInTheDocument()
    expect(screen.getByText("Schools")).toBeInTheDocument()
    const noneTexts = screen.getAllByText("None")
    expect(noneTexts.length).toBe(2)
  })

  it("should only render amenities that are in the visible list", () => {
    mockUseJurisdiction.mockReturnValue({
      data: {
        visibleNeighborhoodAmenities: [NeighborhoodAmenitiesEnum.groceryStores],
      },
    } as mockUseJurisdictionReturnValue)
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (flag) =>
            flag === FeatureFlagEnum.enableNeighborhoodAmenities,
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            listingNeighborhoodAmenities: {
              groceryStores: "0.5 miles",
              publicTransportation: "2 blocks",
              schools: "1 mile",
              pharmacies: "0.3 miles",
            } as ListingNeighborhoodAmenities,
          }}
        >
          <DetailNeighborhoodAmenities />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    expect(screen.getByText("Grocery stores")).toBeInTheDocument()
    expect(screen.queryByText("Public transportation")).not.toBeInTheDocument()
    expect(screen.queryByText("Schools")).not.toBeInTheDocument()
    expect(screen.queryByText("Pharmacies")).not.toBeInTheDocument()
  })

  it("should render all configured visible amenities from jurisdiction", () => {
    mockUseJurisdiction.mockReturnValue({
      data: {
        visibleNeighborhoodAmenities: [
          NeighborhoodAmenitiesEnum.groceryStores,
          NeighborhoodAmenitiesEnum.publicTransportation,
          NeighborhoodAmenitiesEnum.schools,
          NeighborhoodAmenitiesEnum.parksAndCommunityCenters,
          NeighborhoodAmenitiesEnum.pharmacies,
        ],
      },
    } as mockUseJurisdictionReturnValue)

    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (flag) =>
            flag === FeatureFlagEnum.enableNeighborhoodAmenities,
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            listingNeighborhoodAmenities: {
              groceryStores: "Close",
              publicTransportation: "Very close",
              schools: "Medium",
              parksAndCommunityCenters: "Far",
              pharmacies: null,
            } as ListingNeighborhoodAmenities,
          }}
        >
          <DetailNeighborhoodAmenities />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    expect(screen.getByText("Grocery stores")).toBeInTheDocument()
    expect(screen.getByText("Close")).toBeInTheDocument()
    expect(screen.getByText("Public transportation")).toBeInTheDocument()
    expect(screen.getByText("Very close")).toBeInTheDocument()
    expect(screen.getByText("Schools")).toBeInTheDocument()
    expect(screen.getByText("Medium")).toBeInTheDocument()
    expect(screen.getByText("Parks and community centers")).toBeInTheDocument()
    expect(screen.getByText("Far")).toBeInTheDocument()
    expect(screen.getByText("Pharmacies")).toBeInTheDocument()
    expect(screen.getByText("None")).toBeInTheDocument()
  })
})
