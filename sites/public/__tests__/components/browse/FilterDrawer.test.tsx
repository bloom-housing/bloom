/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react"
import { screen } from "@testing-library/dom"
import {
  FeatureFlagEnum,
  HomeTypeEnum,
  ListingFilterKeys,
  MultiselectQuestion,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { mockNextRouter, render } from "../../testUtils"
import { FilterDrawer } from "../../../src/components/browse/FilterDrawer"
import { FilterData } from "../../../src/components/browse/FilterDrawerHelpers"

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

  it("should return all filter fields correctly with no previous selections", () => {
    render(
      <FilterDrawer
        isOpen={true}
        onClose={() => {}}
        onSubmit={() => {}}
        filterState={{}}
        multiselectData={mockMultiselect}
      />
    )
    expect(screen.getByLabelText("Close")).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 1, name: "Filter" })).toBeInTheDocument()

    expect(screen.getByRole("group", { name: "Confirmed listings" })).toBeInTheDocument()
    expect(screen.getByLabelText("Only show listings confirmed by property")).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Only show listings confirmed by property" })
    ).not.toBeChecked()

    expect(screen.getByRole("group", { name: "Availability" })).toBeInTheDocument()
    expect(screen.getByLabelText("Units available")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Units available" })).not.toBeChecked()
    expect(screen.getByLabelText("Open waitlist")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Open waitlist" })).not.toBeChecked()
    expect(screen.getByLabelText("Closed waitlist")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Closed waitlist" })).not.toBeChecked()
    expect(screen.getByLabelText("Coming soon")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Coming soon" })).not.toBeChecked()

    expect(screen.getByRole("group", { name: "Home type" })).toBeInTheDocument()
    expect(screen.getByLabelText("Apartment")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Apartment" })).not.toBeChecked()
    expect(screen.getByLabelText("Duplex")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Duplex" })).not.toBeChecked()
    expect(screen.getByLabelText("Single family house")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Single family house" })).not.toBeChecked()
    expect(screen.getByLabelText("Townhome")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Townhome" })).not.toBeChecked()

    expect(screen.getByRole("group", { name: "Bedroom size" })).toBeInTheDocument()
    expect(screen.getByLabelText("Studio")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Studio" })).not.toBeChecked()
    expect(screen.getByLabelText("SRO")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "SRO" })).not.toBeChecked()
    expect(screen.getByLabelText("1 bedroom")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "1 bedroom" })).not.toBeChecked()
    expect(screen.getByLabelText("2 bedroom")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "2 bedroom" })).not.toBeChecked()
    expect(screen.getByLabelText("3 bedroom")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "3 bedroom" })).not.toBeChecked()
    expect(screen.getByLabelText("4 bedroom")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "4 bedroom" })).not.toBeChecked()
    expect(screen.getByLabelText("5 bedroom")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "5 bedroom" })).not.toBeChecked()

    expect(screen.getByRole("group", { name: "Rent" })).toBeInTheDocument()
    expect(screen.getByLabelText("Min rent")).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Min rent" })).toHaveValue("")
    expect(screen.getByLabelText("Max rent")).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Max rent" })).toHaveValue("")
    expect(screen.getByLabelText("Accepts Section 8 Housing Choice vouchers")).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Accepts Section 8 Housing Choice vouchers" })
    ).not.toBeChecked()

    expect(screen.getByRole("group", { name: "Region" })).toBeInTheDocument()
    expect(screen.getByLabelText("Greater Downtown")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Greater Downtown" })).not.toBeChecked()
    expect(screen.getByLabelText("Eastside")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Eastside" })).not.toBeChecked()
    expect(screen.getByLabelText("Southwest")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Southwest" })).not.toBeChecked()
    expect(screen.getByLabelText("Westside")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Westside" })).not.toBeChecked()

    expect(screen.getByRole("checkbox", { name: "Wheelchair Ramp" })).not.toBeChecked()
    expect(screen.getByLabelText("Wheelchair Ramp")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Elevator" })).not.toBeChecked()
    expect(screen.getByLabelText("Elevator")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Service Animals Allowed" })).not.toBeChecked()
    expect(screen.getByLabelText("Service Animals Allowed")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Accessible Parking Spots" })).not.toBeChecked()
    expect(screen.getByLabelText("Accessible Parking Spots")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Parking On Site" })).not.toBeChecked()
    expect(screen.getByLabelText("Parking On Site")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "In-unit washer/dryer" })).not.toBeChecked()
    expect(screen.getByLabelText("In-unit washer/dryer")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Laundry in Building" })).not.toBeChecked()
    expect(screen.getByLabelText("Laundry in Building")).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Barrier-free (no-step) property entrance" })
    ).not.toBeChecked()
    expect(screen.getByLabelText("Barrier-free (no-step) property entrance")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Roll-in showers" })).not.toBeChecked()
    expect(screen.getByLabelText("Roll-in showers")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Grab bars in bathrooms" })).not.toBeChecked()
    expect(screen.getByLabelText("Grab bars in bathrooms")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Heating in Unit" })).not.toBeChecked()
    expect(screen.getByLabelText("Heating in Unit")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "AC in Unit" })).not.toBeChecked()
    expect(screen.getByLabelText("AC in Unit")).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Units for those with hearing disabilities" })
    ).not.toBeChecked()
    expect(screen.getByLabelText("Units for those with hearing disabilities")).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Units for those with mobility disabilities" })
    ).not.toBeChecked()
    expect(screen.getByLabelText("Units for those with mobility disabilities")).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Units for those with visual disabilities" })
    ).not.toBeChecked()
    expect(screen.getByLabelText("Units for those with visual disabilities")).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Barrier-free (no-step) unit entrances" })
    ).not.toBeChecked()
    expect(screen.getByLabelText("Barrier-free (no-step) unit entrances")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Lowered light switches" })).not.toBeChecked()
    expect(screen.getByLabelText("Lowered light switches")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Barrier-free bathrooms" })).not.toBeChecked()
    expect(screen.getByLabelText("Barrier-free bathrooms")).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Wide unit doorways for wheelchairs" })
    ).not.toBeChecked()
    expect(screen.getByLabelText("Wide unit doorways for wheelchairs")).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Lowered cabinets and countertops" })
    ).not.toBeChecked()
    expect(screen.getByLabelText("Lowered cabinets and countertops")).toBeInTheDocument()

    expect(screen.getByLabelText("Listing name")).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Listing name" })).toHaveValue("")
    expect(screen.getByText("Enter full or partial listing name")).toBeInTheDocument()

    expect(screen.getByRole("group", { name: "Community" })).toBeInTheDocument()
    expect(screen.getByLabelText("Community Type One")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Community Type One" })).not.toBeChecked()
    expect(screen.getByLabelText("Community Type Two")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Community Type Two" })).not.toBeChecked()
    expect(screen.getByLabelText("Community Type Three")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Community Type Three" })).not.toBeChecked()
    expect(screen.getByLabelText("Community Type Four")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Community Type Four" })).not.toBeChecked()

    expect(screen.getByRole("button", { name: "Show matching listings" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
  })

  it("should return all filter fields correctly with previous selections", () => {
    const filterState: FilterData = {
      [ListingFilterKeys.isVerified]: true,
      [ListingFilterKeys.section8Acceptance]: true,
      [ListingFilterKeys.homeTypes]: {
        [HomeTypeEnum.apartment]: true,
        [HomeTypeEnum.duplex]: true,
      },
      [ListingFilterKeys.monthlyRent]: { minRent: "500.00", maxRent: "900.00" },
      [ListingFilterKeys.name]: "Test Search",
    }

    render(
      <FilterDrawer
        isOpen={true}
        onClose={() => {}}
        onSubmit={() => {}}
        filterState={filterState}
        multiselectData={mockMultiselect}
      />
    )
    expect(screen.getByLabelText("Close")).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 1, name: "Filter" })).toBeInTheDocument()

    expect(screen.getByRole("group", { name: "Confirmed listings" })).toBeInTheDocument()
    expect(screen.getByLabelText("Only show listings confirmed by property")).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Only show listings confirmed by property" })
    ).toBeChecked()

    expect(screen.getByRole("group", { name: "Availability" })).toBeInTheDocument()
    expect(screen.getByLabelText("Units available")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Units available" })).not.toBeChecked()
    expect(screen.getByLabelText("Open waitlist")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Open waitlist" })).not.toBeChecked()
    expect(screen.getByLabelText("Closed waitlist")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Closed waitlist" })).not.toBeChecked()
    expect(screen.getByLabelText("Coming soon")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Coming soon" })).not.toBeChecked()

    expect(screen.getByRole("group", { name: "Home type" })).toBeInTheDocument()
    expect(screen.getByLabelText("Apartment")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Apartment" })).toBeChecked()
    expect(screen.getByLabelText("Duplex")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Duplex" })).toBeChecked()
    expect(screen.getByLabelText("Single family house")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Single family house" })).not.toBeChecked()
    expect(screen.getByLabelText("Townhome")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Townhome" })).not.toBeChecked()

    expect(screen.getByRole("group", { name: "Bedroom size" })).toBeInTheDocument()
    expect(screen.getByLabelText("Studio")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Studio" })).not.toBeChecked()
    expect(screen.getByLabelText("SRO")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "SRO" })).not.toBeChecked()
    expect(screen.getByLabelText("1 bedroom")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "1 bedroom" })).not.toBeChecked()
    expect(screen.getByLabelText("2 bedroom")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "2 bedroom" })).not.toBeChecked()
    expect(screen.getByLabelText("3 bedroom")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "3 bedroom" })).not.toBeChecked()
    expect(screen.getByLabelText("4 bedroom")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "4 bedroom" })).not.toBeChecked()
    expect(screen.getByLabelText("5 bedroom")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "5 bedroom" })).not.toBeChecked()

    expect(screen.getByRole("group", { name: "Rent" })).toBeInTheDocument()
    expect(screen.getByLabelText("Min rent")).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Min rent" })).toHaveValue("500.00")
    expect(screen.getByLabelText("Max rent")).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Max rent" })).toHaveValue("900.00")
    expect(screen.getByLabelText("Accepts Section 8 Housing Choice vouchers")).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Accepts Section 8 Housing Choice vouchers" })
    ).toBeChecked()

    expect(screen.getByRole("group", { name: "Region" })).toBeInTheDocument()
    expect(screen.getByLabelText("Greater Downtown")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Greater Downtown" })).not.toBeChecked()
    expect(screen.getByLabelText("Eastside")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Eastside" })).not.toBeChecked()
    expect(screen.getByLabelText("Southwest")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Southwest" })).not.toBeChecked()
    expect(screen.getByLabelText("Westside")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Westside" })).not.toBeChecked()

    expect(screen.getByRole("checkbox", { name: "Wheelchair Ramp" })).not.toBeChecked()
    expect(screen.getByLabelText("Wheelchair Ramp")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Elevator" })).not.toBeChecked()
    expect(screen.getByLabelText("Elevator")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Service Animals Allowed" })).not.toBeChecked()
    expect(screen.getByLabelText("Service Animals Allowed")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Accessible Parking Spots" })).not.toBeChecked()
    expect(screen.getByLabelText("Accessible Parking Spots")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Parking On Site" })).not.toBeChecked()
    expect(screen.getByLabelText("Parking On Site")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "In-unit washer/dryer" })).not.toBeChecked()
    expect(screen.getByLabelText("In-unit washer/dryer")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Laundry in Building" })).not.toBeChecked()
    expect(screen.getByLabelText("Laundry in Building")).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Barrier-free (no-step) property entrance" })
    ).not.toBeChecked()
    expect(screen.getByLabelText("Barrier-free (no-step) property entrance")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Roll-in showers" })).not.toBeChecked()
    expect(screen.getByLabelText("Roll-in showers")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Grab bars in bathrooms" })).not.toBeChecked()
    expect(screen.getByLabelText("Grab bars in bathrooms")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Heating in Unit" })).not.toBeChecked()
    expect(screen.getByLabelText("Heating in Unit")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "AC in Unit" })).not.toBeChecked()
    expect(screen.getByLabelText("AC in Unit")).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Units for those with hearing disabilities" })
    ).not.toBeChecked()
    expect(screen.getByLabelText("Units for those with hearing disabilities")).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Units for those with mobility disabilities" })
    ).not.toBeChecked()
    expect(screen.getByLabelText("Units for those with mobility disabilities")).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Units for those with visual disabilities" })
    ).not.toBeChecked()
    expect(screen.getByLabelText("Units for those with visual disabilities")).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Barrier-free (no-step) unit entrances" })
    ).not.toBeChecked()
    expect(screen.getByLabelText("Barrier-free (no-step) unit entrances")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Lowered light switches" })).not.toBeChecked()
    expect(screen.getByLabelText("Lowered light switches")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Barrier-free bathrooms" })).not.toBeChecked()
    expect(screen.getByLabelText("Barrier-free bathrooms")).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Wide unit doorways for wheelchairs" })
    ).not.toBeChecked()
    expect(screen.getByLabelText("Wide unit doorways for wheelchairs")).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Lowered cabinets and countertops" })
    ).not.toBeChecked()
    expect(screen.getByLabelText("Lowered cabinets and countertops")).toBeInTheDocument()

    expect(screen.getByLabelText("Listing name")).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Listing name" })).toHaveValue("Test Search")
    expect(screen.getByText("Enter full or partial listing name")).toBeInTheDocument()

    expect(screen.getByRole("group", { name: "Community" })).toBeInTheDocument()
    expect(screen.getByLabelText("Community Type One")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Community Type One" })).not.toBeChecked()
    expect(screen.getByLabelText("Community Type Two")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Community Type Two" })).not.toBeChecked()
    expect(screen.getByLabelText("Community Type Three")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Community Type Three" })).not.toBeChecked()
    expect(screen.getByLabelText("Community Type Four")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Community Type Four" })).not.toBeChecked()

    expect(screen.getByRole("button", { name: "Show matching listings" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
  })

  it("should return correct unit types fields with unit groups", () => {
    render(
      <FilterDrawer
        isOpen={true}
        onClose={() => {}}
        onSubmit={() => {}}
        filterState={{}}
        multiselectData={mockMultiselect}
        activeFeatureFlags={[FeatureFlagEnum.enableUnitGroups]}
      />
    )

    expect(screen.getByRole("group", { name: "Bedroom size" })).toBeInTheDocument()
    expect(screen.getByLabelText("Studio")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Studio" })).not.toBeChecked()
    expect(screen.getByLabelText("1 bedroom")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "1 bedroom" })).not.toBeChecked()
    expect(screen.getByLabelText("2 bedroom")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "2 bedroom" })).not.toBeChecked()
    expect(screen.getByLabelText("3 bedroom")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "3 bedroom" })).not.toBeChecked()
    expect(screen.getByLabelText("4 bedroom")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "4 bedroom" })).not.toBeChecked()
    expect(screen.queryByLabelText("SRO")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("5 bedroom")).not.toBeInTheDocument()
  })
})
