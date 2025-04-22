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
})
