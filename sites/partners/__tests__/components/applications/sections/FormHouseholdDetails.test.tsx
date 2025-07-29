import React from "react"
import { mockNextRouter, render, screen } from "../../../testUtils"
import { FormProviderWrapper } from "./helpers"
import { FormHouseholdDetails } from "../../../../src/components/applications/PaperApplicationForm/sections/FormHouseholdDetails"
import { UnitTypeEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { unit } from "@bloom-housing/shared-helpers/__tests__/testHelpers"

beforeAll(() => {
  mockNextRouter()
})

describe("<FormHouseholdDetails>", () => {
  it("renders the form with household details fields", () => {
    render(
      <FormProviderWrapper>
        <FormHouseholdDetails
          listingUnits={Object.values(UnitTypeEnum).map((item, index) => ({
            ...unit,
            unitTypes: {
              id: `id_${index}`,
              createdAt: new Date(),
              updatedAt: new Date(),
              numBedrooms: index,
              name: item,
            },
          }))}
          applicationUnitTypes={[]}
          applicationAccessibilityFeatures={{
            id: "id",
            createdAt: new Date(),
            updatedAt: new Date(),
            mobility: true,
            vision: true,
            hearing: true,
          }}
          listingUnitGroups={[]}
          enableUnitGroups={false}
        />
      </FormProviderWrapper>
    )

    expect(
      screen.getByRole("heading", { level: 2, name: /household details/i })
    ).toBeInTheDocument()

    expect(screen.getByText(/preferred unit sizes/i)).toBeInTheDocument()
    expect(screen.getByLabelText("5 Bedroom")).toBeInTheDocument()
    expect(screen.getByLabelText("4 Bedroom")).toBeInTheDocument()
    expect(screen.getByLabelText("3 Bedroom")).toBeInTheDocument()
    expect(screen.getByLabelText("2 Bedroom")).toBeInTheDocument()
    expect(screen.getByLabelText("1 Bedroom")).toBeInTheDocument()
    expect(screen.getByLabelText("SRO")).toBeInTheDocument()
    expect(screen.getByLabelText("Studio")).toBeInTheDocument()

    expect(screen.getByText(/ada priorities selected/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mobility impairments/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/vision impairments/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/hearing impairments/i)).toBeInTheDocument()

    expect(screen.getByText(/expecting household changes/i)).toBeInTheDocument()
    expect(screen.getByText(/household includes student or member nearing 18/i)).toBeInTheDocument()
    expect(screen.getAllByLabelText(/yes/i)).toHaveLength(2)
    expect(screen.getAllByLabelText(/no/i)).toHaveLength(2)
  })

  it("renders the form with unit groups when enabled", () => {
    render(
      <FormProviderWrapper>
        <FormHouseholdDetails
          listingUnits={[]}
          applicationUnitTypes={[]}
          applicationAccessibilityFeatures={{
            id: "id",
            createdAt: new Date(),
            updatedAt: new Date(),
            mobility: true,
            vision: true,
            hearing: true,
          }}
          listingUnitGroups={[
            {
              id: "group1",
              createdAt: new Date(),
              updatedAt: new Date(),
              unitTypes: [
                {
                  id: "studio-type",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  numBedrooms: 0,
                  name: UnitTypeEnum.studio,
                },
                {
                  id: "one-bdrm-type",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  numBedrooms: 1,
                  name: UnitTypeEnum.oneBdrm,
                },
              ],
              openWaitlist: true,
            },
            {
              id: "group2",
              createdAt: new Date(),
              updatedAt: new Date(),
              unitTypes: [
                {
                  id: "two-bdrm-type",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  numBedrooms: 2,
                  name: UnitTypeEnum.twoBdrm,
                },
                {
                  id: "three-bdrm-type",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  numBedrooms: 3,
                  name: UnitTypeEnum.threeBdrm,
                },
              ],
              openWaitlist: true,
            },
          ]}
          enableUnitGroups={true}
        />
      </FormProviderWrapper>
    )

    expect(
      screen.getByRole("heading", { level: 2, name: /household details/i })
    ).toBeInTheDocument()

    expect(screen.getByText(/preferred unit sizes/i)).toBeInTheDocument()
    expect(screen.getByLabelText("Studio")).toBeInTheDocument()
    expect(screen.getByLabelText("1 Bedroom")).toBeInTheDocument()
    expect(screen.getByLabelText("2 Bedroom")).toBeInTheDocument()
    expect(screen.getByLabelText("3 Bedroom")).toBeInTheDocument()

    expect(screen.getByText(/ada priorities selected/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mobility impairments/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/vision impairments/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/hearing impairments/i)).toBeInTheDocument()

    expect(screen.getByText(/expecting household changes/i)).toBeInTheDocument()
    expect(screen.getByText(/household includes student or member nearing 18/i)).toBeInTheDocument()
    expect(screen.getAllByLabelText(/yes/i)).toHaveLength(2)
    expect(screen.getAllByLabelText(/no/i)).toHaveLength(2)
  })

  it("handles unit groups with duplicate unit types", () => {
    render(
      <FormProviderWrapper>
        <FormHouseholdDetails
          listingUnits={[]}
          applicationUnitTypes={[]}
          applicationAccessibilityFeatures={{
            id: "id",
            createdAt: new Date(),
            updatedAt: new Date(),
            mobility: true,
            vision: true,
            hearing: true,
          }}
          listingUnitGroups={[
            {
              id: "group1",
              createdAt: new Date(),
              updatedAt: new Date(),
              unitTypes: [
                {
                  id: "studio-type",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  numBedrooms: 0,
                  name: UnitTypeEnum.studio,
                },
                {
                  id: "one-bdrm-type",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  numBedrooms: 1,
                  name: UnitTypeEnum.oneBdrm,
                },
              ],
              openWaitlist: true,
            },
            {
              id: "group2",
              createdAt: new Date(),
              updatedAt: new Date(),
              unitTypes: [
                {
                  id: "one-bdrm-type", // Duplicate - should only appear once
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  numBedrooms: 1,
                  name: UnitTypeEnum.oneBdrm,
                },
                {
                  id: "studio-type", // Duplicate - should only appear once
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  numBedrooms: 0,
                  name: UnitTypeEnum.studio,
                },
              ],
              openWaitlist: true,
            },
          ]}
          enableUnitGroups={true}
        />
      </FormProviderWrapper>
    )

    expect(screen.getByText(/preferred unit sizes/i)).toBeInTheDocument()

    const studioLabels = screen.getAllByRole("checkbox", { name: "Studio" })
    const oneBedroomLabels = screen.getAllByRole("checkbox", { name: "1 Bedroom" })

    expect(studioLabels).toHaveLength(1)
    expect(oneBedroomLabels).toHaveLength(1)
  })

  it("displays all available unit types when unit groups contain all types", () => {
    render(
      <FormProviderWrapper>
        <FormHouseholdDetails
          listingUnits={[]}
          applicationUnitTypes={[]}
          applicationAccessibilityFeatures={{
            id: "id",
            createdAt: new Date(),
            updatedAt: new Date(),
            mobility: true,
            vision: true,
            hearing: true,
          }}
          listingUnitGroups={[
            {
              id: "group1",
              createdAt: new Date(),
              updatedAt: new Date(),
              unitTypes: [
                {
                  id: "studio-type",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  numBedrooms: 0,
                  name: UnitTypeEnum.studio,
                },
                {
                  id: "one-bdrm-type",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  numBedrooms: 1,
                  name: UnitTypeEnum.oneBdrm,
                },
                {
                  id: "two-bdrm-type",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  numBedrooms: 2,
                  name: UnitTypeEnum.twoBdrm,
                },
                {
                  id: "three-bdrm-type",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  numBedrooms: 3,
                  name: UnitTypeEnum.threeBdrm,
                },
              ],
              openWaitlist: true,
            },
            {
              id: "group2",
              createdAt: new Date(),
              updatedAt: new Date(),
              unitTypes: [
                {
                  id: "four-bdrm-type",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  numBedrooms: 4,
                  name: UnitTypeEnum.fourBdrm,
                },
                {
                  id: "five-bdrm-type",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  numBedrooms: 5,
                  name: UnitTypeEnum.fiveBdrm,
                },
                {
                  id: "sro-type",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  numBedrooms: 0,
                  name: UnitTypeEnum.SRO,
                },
              ],
              openWaitlist: true,
            },
          ]}
          enableUnitGroups={true}
        />
      </FormProviderWrapper>
    )

    expect(screen.getByText(/preferred unit sizes/i)).toBeInTheDocument()

    // Test all unit types are displayed
    expect(screen.getByRole("checkbox", { name: "Studio" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "1 Bedroom" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "2 Bedroom" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "3 Bedroom" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "4 Bedroom" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "5 Bedroom" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "SRO" })).toBeInTheDocument()

    // Verify we have all 7 unit type checkboxes
    const unitTypeCheckboxes = screen
      .getAllByRole("checkbox")
      .filter((checkbox) => checkbox.getAttribute("name") === "application.preferredUnit")
    expect(unitTypeCheckboxes).toHaveLength(7)
  })
  it("should hide preferred unit sizes if there are no unit groups", () => {
    render(
      <FormProviderWrapper>
        <FormHouseholdDetails
          listingUnits={[]}
          applicationUnitTypes={[]}
          applicationAccessibilityFeatures={{
            id: "id",
            createdAt: new Date(),
            updatedAt: new Date(),
            mobility: true,
            vision: true,
            hearing: true,
          }}
          listingUnitGroups={[]}
          enableUnitGroups={true}
        />
      </FormProviderWrapper>
    )
    expect(screen.queryByText(/preferred unit sizes/i)).not.toBeInTheDocument()
  })
})
