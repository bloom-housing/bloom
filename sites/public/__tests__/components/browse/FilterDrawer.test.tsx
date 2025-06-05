/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react"
import { screen } from "@testing-library/dom"
import {
  MultiselectQuestion,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { mockNextRouter, render } from "../../testUtils"
import { FilterDrawer } from "../../../src/components/browse/FilterDrawer"

describe("FilterDrawer", () => {
  beforeEach(() => {
    mockNextRouter()
  })
  const mockMultiselect: MultiselectQuestion[] = [
    {
      id: "idOne",
      createdAt: new Date(),
      updatedAt: new Date(),
      text: "Community Type One",
      jurisdictions: [{ id: "jurisId" }],
      applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
    },
    {
      id: "idTwo",
      createdAt: new Date(),
      updatedAt: new Date(),
      text: "Community Type Two",
      jurisdictions: [{ id: "jurisId" }],
      applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
    },
    {
      id: "idThree",
      createdAt: new Date(),
      updatedAt: new Date(),
      text: "Community Type Three",
      jurisdictions: [{ id: "jurisId" }],
      applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
    },
    {
      id: "idFour",
      createdAt: new Date(),
      updatedAt: new Date(),
      text: "Community Type Four",
      jurisdictions: [{ id: "jurisId" }],
      applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
    },
  ]

  it("should return all filter fields correctly", () => {
    render(
      <FilterDrawer
        isOpen={true}
        onClose={() => {}}
        onSubmit={() => {}}
        filterState={{}}
        multiselectData={mockMultiselect}
      />
    )
    expect(screen.getByLabelText("Close"))
    expect(screen.getByRole("heading", { level: 1, name: "Filter" }))

    expect(screen.getByRole("group", { name: "Confirmed listings" }))
    expect(screen.getByLabelText("Only show listings confirmed by property"))
    expect(
      screen.getByRole("checkbox", { name: "Only show listings confirmed by property" })
    ).not.toBeChecked()

    expect(screen.getByRole("group", { name: "Availability" }))
    expect(screen.getByLabelText("Units available"))
    expect(screen.getByRole("checkbox", { name: "Units available" })).not.toBeChecked()
    expect(screen.getByLabelText("Open waitlist"))
    expect(screen.getByRole("checkbox", { name: "Open waitlist" })).not.toBeChecked()
    expect(screen.getByLabelText("Closed waitlist"))
    expect(screen.getByRole("checkbox", { name: "Closed waitlist" })).not.toBeChecked()
    expect(screen.getByLabelText("Coming soon"))
    expect(screen.getByRole("checkbox", { name: "Coming soon" })).not.toBeChecked()

    expect(screen.getByRole("group", { name: "Home type" }))
    expect(screen.getByLabelText("Apartment"))
    expect(screen.getByRole("checkbox", { name: "Apartment" })).not.toBeChecked()
    expect(screen.getByLabelText("Duplex"))
    expect(screen.getByRole("checkbox", { name: "Duplex" })).not.toBeChecked()
    expect(screen.getByLabelText("Single family house"))
    expect(screen.getByRole("checkbox", { name: "Single family house" })).not.toBeChecked()
    expect(screen.getByLabelText("Townhome"))
    expect(screen.getByRole("checkbox", { name: "Townhome" })).not.toBeChecked()

    expect(screen.getByRole("group", { name: "Bedroom size" }))
    expect(screen.getByLabelText("Studio"))
    expect(screen.getByRole("checkbox", { name: "Studio" })).not.toBeChecked()
    expect(screen.getByLabelText("SRO"))
    expect(screen.getByRole("checkbox", { name: "SRO" })).not.toBeChecked()
    expect(screen.getByLabelText("1 bedroom"))
    expect(screen.getByRole("checkbox", { name: "1 bedroom" })).not.toBeChecked()
    expect(screen.getByLabelText("2 bedroom"))
    expect(screen.getByRole("checkbox", { name: "2 bedroom" })).not.toBeChecked()
    expect(screen.getByLabelText("3 bedroom"))
    expect(screen.getByRole("checkbox", { name: "3 bedroom" })).not.toBeChecked()
    expect(screen.getByLabelText("4 bedroom"))
    expect(screen.getByRole("checkbox", { name: "4 bedroom" })).not.toBeChecked()
    expect(screen.getByLabelText("5 bedroom"))
    expect(screen.getByRole("checkbox", { name: "5 bedroom" })).not.toBeChecked()

    expect(screen.getByRole("group", { name: "Rent" }))
    expect(screen.getByLabelText("Min rent"))
    expect(screen.getByRole("textbox", { name: "Min rent" })).toHaveValue("")
    expect(screen.getByLabelText("Max rent"))
    expect(screen.getByRole("textbox", { name: "Max rent" })).toHaveValue("")
    expect(screen.getByLabelText("Accepts Section 8 Housing Choice vouchers"))
    expect(
      screen.getByRole("checkbox", { name: "Accepts Section 8 Housing Choice vouchers" })
    ).not.toBeChecked()

    expect(screen.getByRole("group", { name: "Region" }))
    expect(screen.getByLabelText("Greater Downtown"))
    expect(screen.getByRole("checkbox", { name: "Greater Downtown" })).not.toBeChecked()
    expect(screen.getByLabelText("Eastside"))
    expect(screen.getByRole("checkbox", { name: "Eastside" })).not.toBeChecked()
    expect(screen.getByLabelText("Southwest"))
    expect(screen.getByRole("checkbox", { name: "Southwest" })).not.toBeChecked()
    expect(screen.getByLabelText("Westside"))
    expect(screen.getByRole("checkbox", { name: "Westside" })).not.toBeChecked()

    expect(screen.getByRole("checkbox", { name: "Wheelchair Ramp" })).not.toBeChecked()
    expect(screen.getByLabelText("Wheelchair Ramp"))
    expect(screen.getByRole("checkbox", { name: "Elevator" })).not.toBeChecked()
    expect(screen.getByLabelText("Elevator"))
    expect(screen.getByRole("checkbox", { name: "Service Animals Allowed" })).not.toBeChecked()
    expect(screen.getByLabelText("Service Animals Allowed"))
    expect(screen.getByRole("checkbox", { name: "Accessible Parking Spots" })).not.toBeChecked()
    expect(screen.getByLabelText("Accessible Parking Spots"))
    expect(screen.getByRole("checkbox", { name: "Parking On Site" })).not.toBeChecked()
    expect(screen.getByLabelText("Parking On Site"))
    expect(screen.getByRole("checkbox", { name: "In-unit washer/dryer" })).not.toBeChecked()
    expect(screen.getByLabelText("In-unit washer/dryer"))
    expect(screen.getByRole("checkbox", { name: "Laundry in Building" })).not.toBeChecked()
    expect(screen.getByLabelText("Laundry in Building"))
    expect(
      screen.getByRole("checkbox", { name: "Barrier-free (no-step) property entrance" })
    ).not.toBeChecked()
    expect(screen.getByLabelText("Barrier-free (no-step) property entrance"))
    expect(screen.getByRole("checkbox", { name: "Roll-in showers" })).not.toBeChecked()
    expect(screen.getByLabelText("Roll-in showers"))
    expect(screen.getByRole("checkbox", { name: "Grab bars in bathrooms" })).not.toBeChecked()
    expect(screen.getByLabelText("Grab bars in bathrooms"))
    expect(screen.getByRole("checkbox", { name: "Heating in Unit" })).not.toBeChecked()
    expect(screen.getByLabelText("Heating in Unit"))
    expect(screen.getByRole("checkbox", { name: "AC in Unit" })).not.toBeChecked()
    expect(screen.getByLabelText("AC in Unit"))
    expect(
      screen.getByRole("checkbox", { name: "Units for those with hearing disabilities" })
    ).not.toBeChecked()
    expect(screen.getByLabelText("Units for those with hearing disabilities"))
    expect(
      screen.getByRole("checkbox", { name: "Units for those with mobility disabilities" })
    ).not.toBeChecked()
    expect(screen.getByLabelText("Units for those with mobility disabilities"))
    expect(
      screen.getByRole("checkbox", { name: "Units for those with visual disabilities" })
    ).not.toBeChecked()
    expect(screen.getByLabelText("Units for those with visual disabilities"))
    expect(
      screen.getByRole("checkbox", { name: "Barrier-free (no-step) unit entrances" })
    ).not.toBeChecked()
    expect(screen.getByLabelText("Barrier-free (no-step) unit entrances"))
    expect(screen.getByRole("checkbox", { name: "Lowered light switches" })).not.toBeChecked()
    expect(screen.getByLabelText("Lowered light switches"))
    expect(screen.getByRole("checkbox", { name: "Barrier-free bathrooms" })).not.toBeChecked()
    expect(screen.getByLabelText("Barrier-free bathrooms"))
    expect(
      screen.getByRole("checkbox", { name: "Wide unit doorways for wheelchairs" })
    ).not.toBeChecked()
    expect(screen.getByLabelText("Wide unit doorways for wheelchairs"))
    expect(
      screen.getByRole("checkbox", { name: "Lowered cabinets and countertops" })
    ).not.toBeChecked()
    expect(screen.getByLabelText("Lowered cabinets and countertops"))

    expect(screen.getByLabelText("Listing name"))
    expect(screen.getByRole("textbox", { name: "Listing name" })).toHaveValue("")
    expect(screen.getByText("Enter full or partial listing name"))

    expect(screen.getByRole("group", { name: "Community" }))
    expect(screen.getByLabelText("Community Type One"))
    expect(screen.getByRole("checkbox", { name: "Community Type One" })).not.toBeChecked()
    expect(screen.getByLabelText("Community Type Two"))
    expect(screen.getByRole("checkbox", { name: "Community Type Two" })).not.toBeChecked()
    expect(screen.getByLabelText("Community Type Three"))
    expect(screen.getByRole("checkbox", { name: "Community Type Three" })).not.toBeChecked()
    expect(screen.getByLabelText("Community Type Four"))
    expect(screen.getByRole("checkbox", { name: "Community Type Four" })).not.toBeChecked()

    expect(screen.getByRole("button", { name: "Show matching listings" }))
    expect(screen.getByRole("button", { name: "Cancel" }))
  })
})
