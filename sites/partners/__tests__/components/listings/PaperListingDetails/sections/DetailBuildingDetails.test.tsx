import React from "react"
import { render, screen } from "@testing-library/react"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  RegionEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ListingContext } from "../../../../../src/components/listings/ListingContext"
import DetailBuildingDetails from "../../../../../src/components/listings/PaperListingDetails/sections/DetailBuildingDetails"

describe("DetailBuildingDetails", () => {
  it("should render all data, no regions", () => {
    render(
      <ListingContext.Provider
        value={{
          ...listing,
          createdAt: new Date("2023-01-01T10:00:00Z"),
          jurisdictions: { name: "Bloomington", id: "1" },
          id: "1234",
          reviewOrderType: ReviewOrderTypeEnum.waitlist,
          units: [],
        }}
      >
        <DetailBuildingDetails enableConfigurableRegions={false} enableRegions={false} />
      </ListingContext.Provider>
    )
    expect(screen.getByRole("heading", { level: 2, name: "Building details" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 3, name: "Building address" })).toBeInTheDocument()

    expect(screen.getByText("Street address")).toBeInTheDocument()
    expect(screen.getByText(listing.listingsBuildingAddress.street)).toBeInTheDocument()
    expect(screen.getByText("City")).toBeInTheDocument()
    expect(screen.getByText(listing.listingsBuildingAddress.city)).toBeInTheDocument()
    expect(screen.getByText("State")).toBeInTheDocument()
    expect(screen.getByText(listing.listingsBuildingAddress.state)).toBeInTheDocument()
    expect(screen.getByText("Zip code")).toBeInTheDocument()
    expect(screen.getByText(listing.listingsBuildingAddress.zipCode)).toBeInTheDocument()
    expect(screen.getByText("Year built")).toBeInTheDocument()
    expect(screen.getByText(listing.yearBuilt)).toBeInTheDocument()
    expect(screen.getByText("Neighborhood")).toBeInTheDocument()
    expect(screen.getByText(listing.neighborhood)).toBeInTheDocument()
    expect(screen.getByText("Latitude")).toBeInTheDocument()
    expect(screen.getByText(listing.listingsBuildingAddress.latitude)).toBeInTheDocument()
    expect(screen.getByText("Longitude")).toBeInTheDocument()
    expect(screen.getByText(listing.listingsBuildingAddress.longitude)).toBeInTheDocument()
    expect(screen.queryByText("Region")).not.toBeInTheDocument()
  })
  it("should render region feature flag", () => {
    render(
      <ListingContext.Provider
        value={{
          ...listing,
          createdAt: new Date("2023-01-01T10:00:00Z"),
          jurisdictions: { name: "Bloomington", id: "1" },
          id: "1234",
          reviewOrderType: ReviewOrderTypeEnum.waitlist,
          units: [],
          region: RegionEnum.Eastside,
        }}
      >
        <DetailBuildingDetails enableConfigurableRegions={false} enableRegions={true} />
      </ListingContext.Provider>
    )
    expect(screen.getByRole("heading", { level: 2, name: "Building details" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 3, name: "Building address" })).toBeInTheDocument()

    expect(screen.getByText("Street address")).toBeInTheDocument()
    expect(screen.getByText("Region")).toBeInTheDocument()
    expect(screen.getByText("Eastside")).toBeInTheDocument()
  })
  it("should render configurable region feature flag", () => {
    render(
      <ListingContext.Provider
        value={{
          ...listing,
          createdAt: new Date("2023-01-01T10:00:00Z"),
          jurisdictions: { name: "Bloomington", id: "1" },
          id: "1234",
          reviewOrderType: ReviewOrderTypeEnum.waitlist,
          units: [],
          configurableRegion: "Harbor Area",
        }}
      >
        <DetailBuildingDetails enableConfigurableRegions={true} enableRegions={false} />
      </ListingContext.Provider>
    )

    expect(screen.getByText("Street address")).toBeInTheDocument()
    expect(screen.getByText("Region")).toBeInTheDocument()
    expect(screen.getByText("Harbor Area")).toBeInTheDocument()
  })
  it("should render empty optional fields as n/a", () => {
    render(
      <ListingContext.Provider
        value={{
          ...listing,
          createdAt: new Date("2023-01-01T10:00:00Z"),
          jurisdictions: { name: "Bloomington", id: "1" },
          id: "1234",
          reviewOrderType: ReviewOrderTypeEnum.waitlist,
          units: [],
          neighborhood: null,
          yearBuilt: null,
        }}
      >
        <DetailBuildingDetails enableConfigurableRegions={false} enableRegions={false} />
      </ListingContext.Provider>
    )
    expect(screen.getByText("Neighborhood")).toBeInTheDocument()
    expect(screen.getByText("Year built")).toBeInTheDocument()
    expect(screen.getAllByText("n/a", { exact: false })).toHaveLength(2)
  })

  it("should render with no address", () => {
    render(
      <ListingContext.Provider
        value={{
          ...listing,
          createdAt: new Date("2023-01-01T10:00:00Z"),
          jurisdictions: { name: "Bloomington", id: "1" },
          id: "1234",
          reviewOrderType: ReviewOrderTypeEnum.waitlist,
          units: [],
          neighborhood: null,
          yearBuilt: null,
          listingsBuildingAddress: null,
        }}
      >
        <DetailBuildingDetails enableConfigurableRegions={false} enableRegions={false} />
      </ListingContext.Provider>
    )

    expect(screen.getByText("Building address")).toBeInTheDocument()
    expect(screen.getByText("None")).toBeInTheDocument()
  })
})
