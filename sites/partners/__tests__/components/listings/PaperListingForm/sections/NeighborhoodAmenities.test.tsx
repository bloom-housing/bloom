import React from "react"
import { screen, waitFor, within } from "@testing-library/react"
import { FormProvider, useForm } from "react-hook-form"
import { NeighborhoodAmenitiesEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import { mockNextRouter, render } from "../../../../testUtils"
import { formDefaults, FormListing } from "../../../../../src/lib/listings/formTypes"
import NeighborhoodAmenities from "../../../../../src/components/listings/PaperListingForm/sections/NeighborhoodAmenities"

const FormComponent = ({ children, values }: { values?: FormListing; children }) => {
  const formMethods = useForm<FormListing>({
    defaultValues: { ...formDefaults, ...values },
    shouldUnregister: false,
  })
  return <FormProvider {...formMethods}>{children}</FormProvider>
}

beforeAll(() => {
  mockNextRouter()
})

describe("NeighborhoodAmenities", () => {
  const mockJurisdictionWithAllAmenities = {
    id: "jurisdiction1",
    name: "Test Jurisdiction",
    visibleNeighborhoodAmenities: [
      NeighborhoodAmenitiesEnum.groceryStores,
      NeighborhoodAmenitiesEnum.publicTransportation,
      NeighborhoodAmenitiesEnum.schools,
      NeighborhoodAmenitiesEnum.parksAndCommunityCenters,
      NeighborhoodAmenitiesEnum.pharmacies,
      NeighborhoodAmenitiesEnum.healthCareResources,
      NeighborhoodAmenitiesEnum.shoppingVenues,
      NeighborhoodAmenitiesEnum.hospitals,
      NeighborhoodAmenitiesEnum.seniorCenters,
      NeighborhoodAmenitiesEnum.recreationalFacilities,
      NeighborhoodAmenitiesEnum.playgrounds,
      NeighborhoodAmenitiesEnum.busStops,
    ],
  }

  const mockJurisdictionWithLimitedAmenities = {
    id: "jurisdiction2",
    name: "Limited Jurisdiction",
    visibleNeighborhoodAmenities: [
      NeighborhoodAmenitiesEnum.groceryStores,
      NeighborhoodAmenitiesEnum.publicTransportation,
    ],
  }

  it("should not render when feature flag is disabled", () => {
    const { container } = render(
      <FormComponent>
        <NeighborhoodAmenities
          enableNeighborhoodAmenities={false}
          enableNeighborhoodAmenitiesDropdown={false}
          visibleNeighborhoodAmenities={
            mockJurisdictionWithAllAmenities.visibleNeighborhoodAmenities
          }
        />
      </FormComponent>
    )

    expect(container.firstChild).toBeNull()
  })

  it("should render all neighborhood amenities as textareas when dropdown is disabled", async () => {
    render(
      <FormComponent>
        <NeighborhoodAmenities
          enableNeighborhoodAmenities={true}
          enableNeighborhoodAmenitiesDropdown={false}
          visibleNeighborhoodAmenities={
            mockJurisdictionWithAllAmenities.visibleNeighborhoodAmenities
          }
        />
      </FormComponent>
    )

    await screen.findByRole("heading", { name: "Neighborhood amenities" })
    expect(
      screen.getByText(
        "Provide details about any local amenities including grocery stores, health services and parks within 2 miles of your listing."
      )
    ).toBeInTheDocument()

    // Test all visible amenities are rendered as textareas
    for (const amenity of mockJurisdictionWithAllAmenities.visibleNeighborhoodAmenities) {
      const amenityLabel = t(`listings.amenities.${amenity}`)
      const textarea = await screen.findByRole("textbox", { name: amenityLabel })
      expect(textarea).toBeInTheDocument()
      expect(textarea.tagName).toBe("TEXTAREA")
    }
  })

  it("should render neighborhood amenities with dropdowns when dropdown is enabled", async () => {
    render(
      <FormComponent>
        <NeighborhoodAmenities
          enableNeighborhoodAmenities={true}
          enableNeighborhoodAmenitiesDropdown={true}
          visibleNeighborhoodAmenities={
            mockJurisdictionWithAllAmenities.visibleNeighborhoodAmenities
          }
        />
      </FormComponent>
    )

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Neighborhood amenities" })).toBeInTheDocument()
    })
    expect(
      screen.getByText("Please provide details about any nearby amenities.")
    ).toBeInTheDocument()

    // Test all visible amenities are rendered as SELECT dropdowns
    for (const amenity of mockJurisdictionWithAllAmenities.visibleNeighborhoodAmenities) {
      const amenityLabel = t(`listings.amenities.${amenity}`)
      const select = screen.getByRole("combobox", { name: amenityLabel })
      expect(select).toBeInTheDocument()
      expect(select.tagName).toBe("SELECT")
    }
  })

  it("should only render visible amenities from jurisdiction configuration", async () => {
    render(
      <FormComponent>
        <NeighborhoodAmenities
          enableNeighborhoodAmenities={true}
          enableNeighborhoodAmenitiesDropdown={false}
          visibleNeighborhoodAmenities={
            mockJurisdictionWithLimitedAmenities.visibleNeighborhoodAmenities
          }
        />
      </FormComponent>
    )

    await screen.findByRole("heading", { name: "Neighborhood amenities" })

    expect(screen.getByRole("textbox", { name: "Grocery stores" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Public transportation" })).toBeInTheDocument()

    expect(screen.queryByRole("textbox", { name: "Schools" })).not.toBeInTheDocument()
    expect(
      screen.queryByRole("textbox", { name: "Parks and community centers" })
    ).not.toBeInTheDocument()
    expect(screen.queryByRole("textbox", { name: "Pharmacies" })).not.toBeInTheDocument()
    expect(screen.queryByRole("textbox", { name: "Health care resources" })).not.toBeInTheDocument()
  })

  it("should include distance options in dropdown when enabled", async () => {
    render(
      <FormComponent>
        <NeighborhoodAmenities
          enableNeighborhoodAmenities={true}
          enableNeighborhoodAmenitiesDropdown={true}
          visibleNeighborhoodAmenities={
            mockJurisdictionWithLimitedAmenities.visibleNeighborhoodAmenities
          }
        />
      </FormComponent>
    )

    const select = await screen.findByRole("combobox", { name: "Grocery stores" })
    expect(select).toBeInTheDocument()

    const options = within(select).getAllByRole("option")

    const optionTexts = options.map((option) => option.textContent)
    const expectedDistanceOptions = [
      "On site",
      "One block",
      "Two blocks",
      "Three blocks",
      "Four blocks",
      "Five blocks",
      "Within one mile",
      "Within two miles",
      "Within three miles",
      "Within four miles",
    ]
    expect(optionTexts).toContain("Select one")
    expect(optionTexts.length).toBe(expectedDistanceOptions.length + 1)

    for (const distanceOption of expectedDistanceOptions) {
      expect(optionTexts).toContain(distanceOption)
    }
  })

  it("should render partial amenities in 1 row when there are less or equal to 2 amenities", async () => {
    const { container } = render(
      <FormComponent>
        <NeighborhoodAmenities
          enableNeighborhoodAmenities={true}
          enableNeighborhoodAmenitiesDropdown={false}
          visibleNeighborhoodAmenities={
            mockJurisdictionWithLimitedAmenities.visibleNeighborhoodAmenities
          }
        />
      </FormComponent>
    )

    await screen.findByRole("heading", { name: "Neighborhood amenities" })

    // Check that Grid.Row elements are created (2 amenities = 1 row)
    const rows = container.querySelectorAll('[class*="grid-row"]')
    expect(rows.length).toBe(1)
  })
})
