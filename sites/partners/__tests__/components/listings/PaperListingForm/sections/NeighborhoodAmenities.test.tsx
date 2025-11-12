import React from "react"
import { screen, waitFor, within } from "@testing-library/react"
import { FormProvider, useForm } from "react-hook-form"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  Jurisdiction,
  JurisdictionsService,
  NeighborhoodAmenitiesEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
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
    const doJurisdictionsHaveFeatureFlagOn = () => false

    const { container } = render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn,
        }}
      >
        <FormComponent
          values={{ ...formDefaults, jurisdictions: { id: "jurisdiction1" } as Jurisdiction }}
        >
          <NeighborhoodAmenities />
        </FormComponent>
      </AuthContext.Provider>
    )

    expect(container.firstChild).toBeNull()
  })

  it("should not render when no jurisdiction is selected", () => {
    const doJurisdictionsHaveFeatureFlagOn = () => true

    const { container } = render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn,
        }}
      >
        <FormComponent>
          <NeighborhoodAmenities />
        </FormComponent>
      </AuthContext.Provider>
    )

    expect(container.firstChild).toBeNull()
  })

  it("should render all neighborhood amenities as textareas when dropdown is disabled", async () => {
    const mockRetrieve = jest.fn().mockResolvedValue(mockJurisdictionWithAllAmenities)

    const doJurisdictionsHaveFeatureFlagOn = (flag: FeatureFlagEnum) => {
      if (flag === FeatureFlagEnum.enableNeighborhoodAmenities) return true
      if (flag === FeatureFlagEnum.enableNeighborhoodAmenitiesDropdown) return false
      return false
    }

    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn,
          jurisdictionsService: {
            retrieve: mockRetrieve,
          } as unknown as JurisdictionsService,
        }}
      >
        <FormComponent
          values={{ ...formDefaults, jurisdictions: { id: "jurisdiction1" } as Jurisdiction }}
        >
          <NeighborhoodAmenities />
        </FormComponent>
      </AuthContext.Provider>
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
    const mockRetrieve = jest.fn().mockResolvedValue(mockJurisdictionWithAllAmenities)

    const doJurisdictionsHaveFeatureFlagOn = (flag: FeatureFlagEnum) => {
      if (flag === FeatureFlagEnum.enableNeighborhoodAmenities) return true
      if (flag === FeatureFlagEnum.enableNeighborhoodAmenitiesDropdown) return true
      return false
    }

    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn,
          jurisdictionsService: {
            retrieve: mockRetrieve,
          } as unknown as JurisdictionsService,
        }}
      >
        <FormComponent
          values={{
            ...formDefaults,
            jurisdictions: { id: "jurisdiction1" } as Jurisdiction,
          }}
        >
          <NeighborhoodAmenities />
        </FormComponent>
      </AuthContext.Provider>
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
    const mockRetrieve = jest.fn().mockResolvedValue(mockJurisdictionWithLimitedAmenities)

    const doJurisdictionsHaveFeatureFlagOn = (flag: FeatureFlagEnum) => {
      if (flag === FeatureFlagEnum.enableNeighborhoodAmenities) return true
      if (flag === FeatureFlagEnum.enableNeighborhoodAmenitiesDropdown) return false
      return false
    }

    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn,
          jurisdictionsService: {
            retrieve: mockRetrieve,
          } as unknown as JurisdictionsService,
        }}
      >
        <FormComponent
          values={{
            ...formDefaults,
            jurisdictions: { id: "jurisdiction2" } as Jurisdiction,
          }}
        >
          <NeighborhoodAmenities />
        </FormComponent>
      </AuthContext.Provider>
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
    const mockRetrieve = jest.fn().mockResolvedValue(mockJurisdictionWithLimitedAmenities)

    const doJurisdictionsHaveFeatureFlagOn = (flag: FeatureFlagEnum) => {
      if (flag === FeatureFlagEnum.enableNeighborhoodAmenities) return true
      if (flag === FeatureFlagEnum.enableNeighborhoodAmenitiesDropdown) return true
      return false
    }

    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn,
          jurisdictionsService: {
            retrieve: mockRetrieve,
          } as unknown as JurisdictionsService,
        }}
      >
        <FormComponent
          values={{ ...formDefaults, jurisdictions: { id: "jurisdiction1" } as Jurisdiction }}
        >
          <NeighborhoodAmenities />
        </FormComponent>
      </AuthContext.Provider>
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
    const mockRetrieve = jest.fn().mockResolvedValue(mockJurisdictionWithLimitedAmenities)

    const doJurisdictionsHaveFeatureFlagOn = (flag: FeatureFlagEnum) => {
      if (flag === FeatureFlagEnum.enableNeighborhoodAmenities) return true
      return false
    }

    const { container } = render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn,
          jurisdictionsService: {
            retrieve: mockRetrieve,
          } as unknown as JurisdictionsService,
        }}
      >
        <FormComponent
          values={{ ...formDefaults, jurisdictions: { id: "jurisdiction2" } as Jurisdiction }}
        >
          <NeighborhoodAmenities />
        </FormComponent>
      </AuthContext.Provider>
    )

    await screen.findByRole("heading", { name: "Neighborhood amenities" })

    // Check that Grid.Row elements are created (2 amenities = 1 row)
    const rows = container.querySelectorAll('[class*="grid-row"]')
    expect(rows.length).toBe(1)
  })
})
