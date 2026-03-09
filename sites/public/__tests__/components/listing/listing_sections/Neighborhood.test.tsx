import React from "react"
import { render, cleanup, screen } from "@testing-library/react"
import { Neighborhood } from "../../../../src/components/listing/listing_sections/Neighborhood"
import {
  FeatureFlagEnum,
  Jurisdiction,
  NeighborhoodAmenitiesEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

afterEach(cleanup)

describe("<Neighborhood>", () => {
  it("shows all content", () => {
    render(
      <Neighborhood
        address={{
          id: "id",
          createdAt: new Date(),
          updatedAt: new Date(),
          city: "Address city",
          street: "Address street",
          street2: "Address unit",
          zipCode: "67890",
          state: "CA",
          latitude: 1,
          longitude: 2,
        }}
        name={"Listing name"}
        neighborhood={"Westend"}
        region={"Downtown"}
        neighborhoodAmenities={{
          groceryStores: "Market",
          pharmacies: "Health store",
          id: "1",
          createdAt: new Date(),
          updatedAt: new Date(),
        }}
        visibleNeighborhoodAmenities={[
          NeighborhoodAmenitiesEnum.groceryStores,
          NeighborhoodAmenitiesEnum.pharmacies,
          NeighborhoodAmenitiesEnum.parksAndCommunityCenters,
          NeighborhoodAmenitiesEnum.publicTransportation,
          NeighborhoodAmenitiesEnum.schools,
          NeighborhoodAmenitiesEnum.healthCareResources,
        ]}
      />
    )
    expect(screen.getAllByRole("heading", { name: "Neighborhood", level: 2 }).length).toBe(1)
    expect(screen.getByRole("heading", { name: "Neighborhood", level: 3 })).toBeDefined()
    expect(screen.getAllByText("Location and transportation").length).toBe(2)
    expect(screen.getByRole("link", { name: "Get directions (opens in a new tab)" })).toBeDefined()
    expect(screen.getByText("Westend")).toBeDefined()
    expect(screen.getByRole("heading", { name: "Region", level: 3 })).toBeDefined()
    expect(screen.getByText("Downtown")).toBeDefined()
    expect(screen.getByRole("heading", { name: "Within 2 miles", level: 3 })).toBeDefined()
    expect(screen.getByRole("heading", { name: "Grocery stores", level: 4 })).toBeDefined()
    expect(screen.getByText("Market")).toBeDefined()
    expect(screen.getByRole("heading", { name: "Pharmacies", level: 4 })).toBeDefined()
    expect(screen.getByText("Health store")).toBeDefined()
  })
  it("hides optional content", () => {
    render(
      <Neighborhood
        address={{
          id: "id",
          createdAt: new Date(),
          updatedAt: new Date(),
          city: "Address city",
          street: "Address street",
          street2: "Address unit",
          zipCode: "67890",
          state: "CA",
          latitude: 1,
          longitude: 2,
        }}
        name={"Listing name"}
      />
    )
    expect(screen.getAllByRole("heading", { name: "Neighborhood", level: 2 }).length).toBe(1)
    expect(screen.getAllByText("Location and transportation").length).toBe(2)
    expect(screen.getByRole("link", { name: "Get directions (opens in a new tab)" })).toBeDefined()
    expect(screen.queryByText("Region")).toBeNull()
    expect(screen.queryByText("Within 2 miles")).toBeNull()
  })

  it("hides amenities that are not visible", () => {
    render(
      <Neighborhood
        address={{
          id: "id",
          createdAt: new Date(),
          updatedAt: new Date(),
          city: "Address city",
          street: "Address street",
          street2: "Address unit",
          zipCode: "67890",
          state: "CA",
          latitude: 1,
          longitude: 2,
        }}
        name={"Listing name"}
        neighborhood={"Westend"}
        region={"Downtown"}
        neighborhoodAmenities={{
          groceryStores: "Market",
          pharmacies: "Health store",
          parksAndCommunityCenters: "Community center",
          publicTransportation: "Bus",
          schools: "School",
          healthCareResources: "Health center",
          id: "1",
          createdAt: new Date(),
          updatedAt: new Date(),
        }}
        visibleNeighborhoodAmenities={[
          NeighborhoodAmenitiesEnum.groceryStores,
          NeighborhoodAmenitiesEnum.pharmacies,
        ]}
      />
    )
    expect(screen.getByText("Grocery stores")).toBeDefined()
    expect(screen.getByText("Pharmacies")).toBeDefined()
    expect(screen.queryByText("Community center")).toBeNull()
    expect(screen.queryByText("Bus")).toBeNull()
    expect(screen.queryByText("School")).toBeNull()
    expect(screen.queryByText("Health center")).toBeNull()
  })

  it("shows neighborhood amenities copy when enableNeighborhoodAmenitiesDropdown flag is enabled", () => {
    render(
      <Neighborhood
        address={{
          id: "id",
          createdAt: new Date(),
          updatedAt: new Date(),
          city: "Address city",
          street: "Address street",
          street2: "Address unit",
          zipCode: "67890",
          state: "CA",
          latitude: 1,
          longitude: 2,
        }}
        name={"Listing name"}
        neighborhood={"Westend"}
        region={"Downtown"}
        neighborhoodAmenities={{
          groceryStores: "Four blocks",
          pharmacies: "Two blocks",
          id: "1",
          createdAt: new Date(),
          updatedAt: new Date(),
        }}
        visibleNeighborhoodAmenities={[
          NeighborhoodAmenitiesEnum.groceryStores,
          NeighborhoodAmenitiesEnum.pharmacies,
        ]}
        jurisdiction={
          {
            id: "jurisdiction1",
            featureFlags: [
              { name: FeatureFlagEnum.enableNeighborhoodAmenitiesDropdown, active: true },
            ],
          } as unknown as Jurisdiction
        }
      />
    )
    expect(screen.getByRole("heading", { name: "Resources in the area", level: 3 })).toBeDefined()
    expect(
      screen.getByText(
        "The neighborhood around this property offers access to the following services and community resources:"
      )
    ).toBeDefined()
    expect(screen.getByRole("heading", { name: "Grocery stores", level: 4 })).toBeDefined()
    expect(screen.getByText("Four blocks")).toBeDefined()
    expect(screen.getByRole("heading", { name: "Pharmacies", level: 4 })).toBeDefined()
    expect(screen.getByText("Two blocks")).toBeDefined()
  })
})
