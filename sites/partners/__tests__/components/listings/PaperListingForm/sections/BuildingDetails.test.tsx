import { EnumListingListingType } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import "@testing-library/jest-dom"
import { screen, within } from "@testing-library/react"
import { setupServer } from "msw/node"
import BuildingDetails from "../../../../../src/components/listings/PaperListingForm/sections/BuildingDetails"
import { FormProviderWrapper, mockNextRouter, render } from "../../../../testUtils"

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
    expect(screen.getByRole("textbox", { name: "Street address" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "City" })).toBeInTheDocument()
    expect(screen.getByLabelText("City")).toBeInTheDocument()
    const stateSelector = screen.getByRole("combobox", { name: "State" })
    expect(stateSelector).toBeInTheDocument()
    // Blank, 50 states, and DC = 52
    expect(within(stateSelector).getAllByRole("option")).toHaveLength(52)
    expect(within(stateSelector).getByRole("option", { name: "Alabama" })).toBeInTheDocument()
    expect(within(stateSelector).getByRole("option", { name: "Wyoming" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Zip code" })).toBeInTheDocument()
    // Neighborhood should be a text box instead of a selector
    expect(screen.getByRole("textbox", { name: "Neighborhood" })).toBeInTheDocument()
    expect(screen.queryAllByRole("combobox", { name: "Neighborhood" })).toHaveLength(0)
    expect(screen.getByRole("spinbutton", { name: "Year built" })).toBeInTheDocument()
    expect(screen.getByText("Map preview")).toBeInTheDocument()
    expect(screen.getByText("Enter an address to preview the map")).toBeInTheDocument()
    expect(screen.getByText("Map pin position")).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: "Automatic" })).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: "Custom" })).toBeInTheDocument()
    expect(screen.getByText("Drag the pin to update the marker location")).toBeInTheDocument()
    expect(screen.queryByRole("combobox", { name: "Region" })).not.toBeInTheDocument()
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

    const regionSelector = screen.getByRole("combobox", { name: "Region" })
    expect(regionSelector).toBeInTheDocument()
    expect(
      within(regionSelector).getByRole("option", { name: "Greater Downtown" })
    ).toBeInTheDocument()
    expect(within(regionSelector).getByRole("option", { name: "Eastside" })).toBeInTheDocument()
    expect(within(regionSelector).getByRole("option", { name: "Southwest" })).toBeInTheDocument()
    expect(within(regionSelector).getByRole("option", { name: "Westside" })).toBeInTheDocument()
    // Neighborhood field should be a select rather than input field
    const neighborhoodSelector = screen.getByRole("combobox", { name: "Neighborhood" })
    expect(neighborhoodSelector).toBeInTheDocument()
    expect(within(neighborhoodSelector).getAllByRole("option")).toHaveLength(24)
    expect(
      within(neighborhoodSelector).getByRole("option", { name: "Boynton" })
    ).toBeInTheDocument()
    expect(
      within(neighborhoodSelector).getByRole("option", { name: "Palmer Park area" })
    ).toBeInTheDocument()
    expect(screen.queryAllByRole("textbox", { name: "Neighborhood" })).toHaveLength(0)
  })

  it.todo("should change the region when selecting a different neighborhood")

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
          regions={["North", "South", "Northeast"]}
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
    const regionSelector = screen.getByRole("combobox", { name: "Region" })
    expect(regionSelector).toBeInTheDocument()
    expect(within(regionSelector).getByRole("option", { name: "North" })).toBeInTheDocument()
    expect(within(regionSelector).getByRole("option", { name: "South" })).toBeInTheDocument()
    expect(within(regionSelector).getByRole("option", { name: "Northeast" })).toBeInTheDocument()
  })

  it("should not render year built field when non-regulated", () => {
    render(
      <FormProviderWrapper values={{ listingType: EnumListingListingType.nonRegulated }}>
        <BuildingDetails
          customMapPositionChosen={false}
          enableConfigurableRegions={true}
          enableNonRegulatedListings={true}
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

    expect(screen.getByRole("combobox", { name: "Region" })).toBeInTheDocument()
    expect(screen.queryAllByRole("spinbutton", { name: "Year built" })).toHaveLength(0)
  })

  it.todo("should display map preview if building address is filled out")
  it.todo("should get new lat long values when address is entered")
})
