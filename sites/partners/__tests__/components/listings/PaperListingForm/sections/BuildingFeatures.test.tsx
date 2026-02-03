import React from "react"
import { render, screen, within } from "@testing-library/react"
import { FormProviderWrapper } from "../../../../testUtils"
import BuildingFeatures from "../../../../../src/components/listings/PaperListingForm/sections/BuildingFeatures"

describe("BuildingFeatures", () => {
  it("should render fields correctly with flags off", () => {
    render(
      <FormProviderWrapper>
        <BuildingFeatures
          enablePetPolicyCheckbox={false}
          enableSmokingPolicyRadio={false}
          enableParkingFee={false}
          enableAccessibilityFeatures={false}
          requiredFields={[]}
        />
      </FormProviderWrapper>
    )

    expect(screen.getByLabelText("Property amenities")).toBeInTheDocument()
    expect(screen.getByLabelText("Additional accessibility")).toBeInTheDocument()
    expect(screen.getByLabelText("Unit amenities")).toBeInTheDocument()
    expect(screen.getByLabelText("Pets policy")).toBeInTheDocument()
    expect(screen.getByLabelText("Services offered")).toBeInTheDocument()
    expect(screen.getByLabelText("Smoking policy")).toBeInTheDocument()

    expect(screen.queryByLabelText("Allows dogs")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("Allows cats")).not.toBeInTheDocument()

    expect(screen.queryByLabelText("Smoking allowed")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("No smoking allowed")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("Policy unknown")).not.toBeInTheDocument()
  })
  it("should render pet policy checkboxes when enablePetPolicyCheckbox is true", () => {
    render(
      <FormProviderWrapper>
        <BuildingFeatures enablePetPolicyCheckbox={true} requiredFields={[]} />
      </FormProviderWrapper>
    )

    expect(screen.queryByLabelText("Pet policy")).not.toBeInTheDocument()
    expect(
      screen.getByRole("group", { name: "What kinds of pets do you allow?" })
    ).toBeInTheDocument()
    expect(screen.getByLabelText("Allows dogs")).toBeInTheDocument()
    expect(screen.getByLabelText("Allows cats")).toBeInTheDocument()
  })

  it("should render smoking policy radio buttons when enableSmokingPolicyRadio is true", () => {
    render(
      <FormProviderWrapper>
        <BuildingFeatures enableSmokingPolicyRadio={true} requiredFields={[]} />
      </FormProviderWrapper>
    )

    expect(screen.queryByLabelText("Smoking policy")).not.toBeInTheDocument()
    expect(screen.getByRole("group", { name: "Smoking policy" })).toBeInTheDocument()
    expect(screen.getByLabelText("Smoking allowed")).toBeInTheDocument()
    expect(screen.getByLabelText("No smoking allowed")).toBeInTheDocument()
    expect(screen.getByLabelText("Policy unknown")).toBeInTheDocument()
  })

  it("should render parking types checkbox buttons when enableParkingTypes feature flag is true", () => {
    render(
      <FormProviderWrapper>
        <BuildingFeatures enableParkingType={true} requiredFields={[]} />
      </FormProviderWrapper>
    )

    const parkingTypesGroup = screen.getByRole("group", { name: /parking types/i })
    expect(parkingTypesGroup).toBeInTheDocument()
    expect(
      within(parkingTypesGroup).getByRole("checkbox", { name: "On Street" })
    ).toBeInTheDocument()
    expect(
      within(parkingTypesGroup).getByRole("checkbox", { name: "Off Street" })
    ).toBeInTheDocument()
    expect(within(parkingTypesGroup).getByRole("checkbox", { name: "Garage" })).toBeInTheDocument()
    expect(within(parkingTypesGroup).getByRole("checkbox", { name: "Carport" })).toBeInTheDocument()
  })
})
