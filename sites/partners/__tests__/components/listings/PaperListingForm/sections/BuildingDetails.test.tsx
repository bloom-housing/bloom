import React from "react"
import "@testing-library/jest-dom"
import { setupServer } from "msw/node"
import { screen } from "@testing-library/react"
import { FormProviderWrapper, mockNextRouter, render } from "../../../../testUtils"
import BuildingDetails from "../../../../../src/components/listings/PaperListingForm/sections/BuildingDetails"

const server = setupServer()

// Enable API mocking before tests.
beforeAll(() => {
  server.listen()
  mockNextRouter()
})

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

describe("BuildingDetails", () => {
  it("should render fields with no region", () => {
    render(
      <FormProviderWrapper>
        <BuildingDetails
          customMapPositionChosen={false}
          enableConfigurableRegions={false}
          enableNonRegulatedListings={false}
          enableRegions={false}
          latLong={undefined}
          listing={undefined}
          regions={undefined}
          requiredFields={[]}
          setCustomMapPositionChosen={() => {
            return
          }}
          setLatLong={() => {
            return
          }}
        />
      </FormProviderWrapper>
    )

    expect(screen.getByRole("heading", { level: 2, name: "Building details" })).toBeInTheDocument()
    expect(screen.getByText("Tell us where the building is located.")).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 3, name: "Building address" })).toBeInTheDocument()
    const streetAddressInput = screen.getByLabelText("Street address")
    expect(streetAddressInput).toBeInTheDocument()
    expect(screen.getByLabelText("City")).toBeInTheDocument()
    expect(screen.getByLabelText("State")).toBeInTheDocument()
    expect(screen.getByLabelText("Zip code")).toBeInTheDocument()
    expect(screen.getByLabelText("Year built")).toBeInTheDocument()
    expect(screen.getByLabelText("Neighborhood")).toBeInTheDocument()
    expect(screen.getByText("Map preview")).toBeInTheDocument()
    expect(screen.getByText("Enter an address to preview the map")).toBeInTheDocument()
    expect(screen.getByText("Map pin position")).toBeInTheDocument()
    expect(screen.getByLabelText("Automatic")).toBeInTheDocument()
    expect(screen.getByLabelText("Custom")).toBeInTheDocument()
    expect(screen.getByText("Drag the pin to update the marker location")).toBeInTheDocument()
    expect(screen.queryByLabelText("Region")).not.toBeInTheDocument()
  })
  it("should render region field with region flag enabled", () => {
    render(
      <FormProviderWrapper>
        <BuildingDetails
          customMapPositionChosen={false}
          enableConfigurableRegions={false}
          enableNonRegulatedListings={false}
          enableRegions={true}
          latLong={undefined}
          listing={undefined}
          regions={undefined}
          requiredFields={[]}
          setCustomMapPositionChosen={() => {
            return
          }}
          setLatLong={() => {
            return
          }}
        />
      </FormProviderWrapper>
    )

    expect(screen.getByLabelText("Region")).toBeInTheDocument()
  })
  it("should render region field with configurable region flag enabled", () => {
    render(
      <FormProviderWrapper>
        <BuildingDetails
          customMapPositionChosen={false}
          enableConfigurableRegions={true}
          enableNonRegulatedListings={false}
          enableRegions={false}
          latLong={undefined}
          listing={undefined}
          regions={undefined}
          requiredFields={[]}
          setCustomMapPositionChosen={() => {
            return
          }}
          setLatLong={() => {
            return
          }}
        />
      </FormProviderWrapper>
    )

    expect(screen.getByLabelText("Region")).toBeInTheDocument()
  })
})
