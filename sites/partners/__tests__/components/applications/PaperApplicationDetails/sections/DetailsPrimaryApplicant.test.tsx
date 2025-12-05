/* eslint-disable import/no-named-as-default */
import React from "react"
import { application } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { ApplicationContext } from "../../../../../src/components/applications/ApplicationContext"
import { mockNextRouter, render, screen, within } from "../../../../testUtils"
import DetailsPrimaryApplicant from "../../../../../src/components/applications/PaperApplicationDetails/sections/DetailsPrimaryApplicant"

describe("DetailsPrimaryApplicant", () => {
  mockNextRouter({ id: "application_1" })

  it("should display Primary Applicant section info", () => {
    render(
      <ApplicationContext.Provider value={application}>
        <DetailsPrimaryApplicant />
      </ApplicationContext.Provider>
    )

    expect(screen.getByRole("heading", { name: "Primary applicant", level: 2 })).toBeInTheDocument()
    expect(within(screen.getByTestId("firstName")).getByText("First name")).toBeInTheDocument()
    expect(within(screen.getByTestId("firstName")).getByText("Applicant First")).toBeInTheDocument()
    expect(within(screen.getByTestId("middleName")).getByText("Middle name")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("middleName")).getByText("Applicant Middle")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("lastName")).getByText("Last name")).toBeInTheDocument()
    expect(within(screen.getByTestId("lastName")).getByText("Applicant Last")).toBeInTheDocument()
    expect(within(screen.getByTestId("dateOfBirth")).getByText("Date of birth")).toBeInTheDocument()
    expect(within(screen.getByTestId("dateOfBirth")).getByText("10/10/1990")).toBeInTheDocument()
    expect(within(screen.getByTestId("emailAddress")).getByText("Email")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("emailAddress")).getByText("first.last@example.com")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("phoneNumber")).getByText("Phone")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("phoneNumber")).getByText("(123) 123-1231")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("phoneNumber")).getByText("Home")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("additionalPhoneNumber")).getByText("Second phone")
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId("additionalPhoneNumber")).getByText("(456) 456-4564")
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId("additionalPhoneNumber")).getByText("Cell")
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId("preferredContact")).getByText("Preferred contact")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("preferredContact")).getByText("n/a")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("workInRegion")).getByText("Work in region")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("workInRegion")).getByText("Yes")).toBeInTheDocument()

    expect(screen.getByRole("heading", { name: "Residence address", level: 3 })).toBeInTheDocument()
    expect(
      within(screen.getByTestId("residenceAddress.streetAddress")).getByText("Street address")
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId("residenceAddress.streetAddress")).getByText(
        "3200 Old Faithful Inn Rd"
      )
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId("residenceAddress.street2")).getByText("Apt or unit #")
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId("residenceAddress.street2")).getByText("12")
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId("residenceAddress.city")).getByText("City")
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId("residenceAddress.city")).getByText("Yellowstone National Park")
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId("residenceAddress.state")).getByText("State")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("residenceAddress.state")).getByText("WY")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("residenceAddress.zipCode")).getByText("Zip code")
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId("residenceAddress.zipCode")).getByText("82190")
    ).toBeInTheDocument()

    expect(screen.getByRole("heading", { name: "Mailing address", level: 3 })).toBeInTheDocument()
    expect(
      within(screen.getByTestId("mailingAddress.streetAddress")).getByText("Street address")
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId("mailingAddress.streetAddress")).getByText("1000 US-36")
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId("mailingAddress.street2")).getByText("Apt or unit #")
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId("mailingAddress.street2")).getByText("n/a")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("mailingAddress.city")).getByText("City")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("mailingAddress.city")).getByText("Estes Park")
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId("mailingAddress.state")).getByText("State")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("mailingAddress.state")).getByText("CO")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("mailingAddress.zipCode")).getByText("Zip code")
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId("mailingAddress.zipCode")).getByText("80517")
    ).toBeInTheDocument()

    expect(screen.getByRole("heading", { name: "Work address", level: 3 })).toBeInTheDocument()
    expect(
      within(screen.getByTestId("workAddress.streetAddress")).getByText("Street address")
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId("workAddress.streetAddress")).getByText("9035 Village Dr")
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId("workAddress.street2")).getByText("Apt or unit #")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("workAddress.street2")).getByText("n/a")).toBeInTheDocument()
    expect(within(screen.getByTestId("workAddress.city")).getByText("City")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("workAddress.city")).getByText("Yosemite Valley")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("workAddress.state")).getByText("State")).toBeInTheDocument()
    expect(within(screen.getByTestId("workAddress.state")).getByText("CA")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("workAddress.zipCode")).getByText("Zip code")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("workAddress.zipCode")).getByText("95389")).toBeInTheDocument()

    expect(screen.queryAllByText("Full-time student")).toHaveLength(0)
  })

  it("should display Primary Applicant section info with full time student question", () => {
    render(
      <ApplicationContext.Provider value={application}>
        <DetailsPrimaryApplicant enableFullTimeStudentQuestion={true} />
      </ApplicationContext.Provider>
    )

    expect(screen.getByText("Full-time student")).toBeInTheDocument()
    expect(screen.getByText("No")).toBeInTheDocument()
  })
})
