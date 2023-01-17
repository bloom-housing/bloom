import React from "react"
import { render, cleanup } from "@testing-library/react"
import { SubmitApplication } from "../../../src/components/listing/SubmitApplication"

afterEach(cleanup)

describe("<SubmitApplication>", () => {
  it("includes mailing address, includes drop off address, includes due date, includes postmarks, includes office hours", () => {
    const { getByText } = render(
      <SubmitApplication
        applicationMailingAddress={{
          city: "City",
          state: "State",
          street2: "Street 2",
          street: "Mailing Address Street",
          zipCode: "90210",
        }}
        applicationDropOffAddress={{
          city: "City",
          state: "State",
          street2: "Street 2",
          street: "Drop Off Address Street",
          zipCode: "90210",
        }}
        applicationDropOffAddressOfficeHours={"M-F 9am-5pm"}
        applicationOrganization={"Application Organization"}
        strings={{
          postmark: "Postmark details string",
          mailHeader: "Mail Header",
          dropOffHeader: "Drop Off Header",
          sectionHeader: "Paper App Header",
          officeHoursHeader: "Office Hours Header",
          mapString: "Get Directions",
        }}
      />
    )
    expect(getByText("Paper App Header")).toBeTruthy()
    expect(getByText("Mail Header")).toBeTruthy()
    expect(getByText("Mailing Address Street", { exact: false })).toBeTruthy()
    expect(getByText("Postmark details string")).toBeTruthy()
    expect(getByText("or")).toBeTruthy()
    expect(getByText("Drop Off Header")).toBeTruthy()
    expect(getByText("Drop Off Address Street", { exact: false })).toBeTruthy()
    expect(getByText("Office Hours Header")).toBeTruthy()
  })
})
