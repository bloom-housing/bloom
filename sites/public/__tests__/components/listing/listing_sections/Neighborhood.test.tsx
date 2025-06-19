import React from "react"
import { render, cleanup, screen } from "@testing-library/react"
import { Neighborhood } from "../../../../src/components/listing/listing_sections/Neighborhood"

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
        neighborhoodAmenities={{ groceryStores: "Market", pharmacies: "Health store" }}
      />
    )
    expect(screen.getAllByRole("heading", { name: "Neighborhood", level: 2 }).length).toBe(2)
    expect(screen.getByRole("heading", { name: "Neighborhood", level: 3 })).toBeDefined()
    expect(screen.getAllByText("Location and transportation").length).toBe(2)
    expect(screen.getByRole("link", { name: "Get Directions (opens in a new tab)" })).toBeDefined()
    expect(screen.getByText("Westend")).toBeDefined()
    expect(screen.getByRole("heading", { name: "Region", level: 3 })).toBeDefined()
    expect(screen.getByText("Downtown")).toBeDefined()
    expect(screen.getByRole("heading", { name: "Within 2 miles", level: 3 })).toBeDefined()
    expect(screen.getByRole("heading", { name: "Grocery Stores", level: 4 })).toBeDefined()
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
    expect(screen.getAllByRole("heading", { name: "Neighborhood", level: 2 }).length).toBe(2)
    expect(screen.getAllByText("Location and transportation").length).toBe(2)
    expect(screen.getByRole("link", { name: "Get Directions (opens in a new tab)" })).toBeDefined()
    expect(screen.queryByText("Region")).toBeNull()
    expect(screen.queryByText("Within 2 miles")).toBeNull()
  })
})
