import React from "react"
import { screen } from "@testing-library/react"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  FeatureFlag,
  FeatureFlagEnum,
  ListingNeighborhoodAmenities,
  NeighborhoodAmenitiesEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ListingContext } from "../../../../../src/components/listings/ListingContext"
import DetailNeighborhoodAmenities from "../../../../../src/components/listings/PaperListingDetails/sections/DetailNeighborhoodAmenities"

import { setupServer } from "msw/lib/node"
import { mockNextRouter, render } from "../../../../testUtils"
import { rest } from "msw"

const server = setupServer()

beforeAll(() => {
  mockNextRouter()
  server.listen()
})

describe("DetailNeighborhoodAmenities", () => {
  beforeEach(() => {
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            userRoles: { id: "user1", isAdmin: true, isPartner: false },
            jurisdictions: [
              {
                id: "id",
                name: "Bloomington",
                visibleNeighborhoodAmenities: [
                  NeighborhoodAmenitiesEnum.groceryStores,
                  NeighborhoodAmenitiesEnum.publicTransportation,
                  NeighborhoodAmenitiesEnum.schools,
                ],
                featureFlags: [
                  {
                    name: FeatureFlagEnum.enableNeighborhoodAmenities,
                    active: true,
                  } as FeatureFlag,
                ],
              },
            ],
          })
        )
      })
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should not render when enableNeighborhoodAmenities feature flag is off", () => {
    const { container } = render(
      <ListingContext.Provider value={{ ...listing }}>
        <DetailNeighborhoodAmenities />
      </ListingContext.Provider>
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("should not render when no visible amenities are configured, even if data exists", () => {
    const { container } = render(
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
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("should render visible amenities with their values", async () => {
    render(
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
    )

    await screen.findByText("Neighborhood amenities")

    expect(screen.getByText("Neighborhood amenities")).toBeInTheDocument()
    expect(screen.getByText("Grocery stores")).toBeInTheDocument()
    expect(screen.getByText("0.5 miles")).toBeInTheDocument()
    expect(screen.getByText("Public transportation")).toBeInTheDocument()
    expect(screen.getByText("2 blocks")).toBeInTheDocument()
    expect(screen.getByText("Schools")).toBeInTheDocument()
    expect(screen.getByText("1 mile")).toBeInTheDocument()
  })

  it("should render 'None' for amenities without values", async () => {
    render(
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
    )

    await screen.findByText("Neighborhood amenities")
    expect(screen.getByText("Grocery stores")).toBeInTheDocument()
    expect(screen.getByText("0.5 miles")).toBeInTheDocument()
    expect(screen.getByText("Public transportation")).toBeInTheDocument()
    expect(screen.getByText("Schools")).toBeInTheDocument()
    const noneTexts = screen.getAllByText("None")
    expect(noneTexts.length).toBe(2)
  })

  it("should only render amenities that are in the visible list", async () => {
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            userRoles: { id: "user1", isAdmin: true, isPartner: false },
            jurisdictions: [
              {
                id: "id",
                name: "Bloomington",
                visibleNeighborhoodAmenities: [NeighborhoodAmenitiesEnum.groceryStores],
                featureFlags: [
                  {
                    name: FeatureFlagEnum.enableNeighborhoodAmenities,
                    active: true,
                  } as FeatureFlag,
                ],
              },
            ],
          })
        )
      })
    )
    render(
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
    )

    await screen.findByText("Neighborhood amenities")
    expect(screen.getByText("Grocery stores")).toBeInTheDocument()
    expect(screen.queryByText("Public transportation")).not.toBeInTheDocument()
    expect(screen.queryByText("Schools")).not.toBeInTheDocument()
    expect(screen.queryByText("Pharmacies")).not.toBeInTheDocument()
  })

  it("should render all configured visible amenities from jurisdiction", async () => {
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            userRoles: { id: "user1", isAdmin: true, isPartner: false },
            jurisdictions: [
              {
                id: "id",
                name: "Bloomington",
                visibleNeighborhoodAmenities: [
                  NeighborhoodAmenitiesEnum.groceryStores,
                  NeighborhoodAmenitiesEnum.publicTransportation,
                  NeighborhoodAmenitiesEnum.schools,
                  NeighborhoodAmenitiesEnum.parksAndCommunityCenters,
                  NeighborhoodAmenitiesEnum.pharmacies,
                ],
                featureFlags: [
                  {
                    name: FeatureFlagEnum.enableNeighborhoodAmenities,
                    active: true,
                  } as FeatureFlag,
                ],
              },
            ],
          })
        )
      })
    )

    render(
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
    )

    await screen.findByText("Neighborhood amenities")

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
