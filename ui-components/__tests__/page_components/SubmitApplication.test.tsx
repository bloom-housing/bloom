import React from "react"
import { render, cleanup } from "@testing-library/react"
import {
  AllFields,
  DropOffNoOfficeHours,
  MailingNoPostmarks,
  MailingWithPostmarks,
} from "../../src/page_components/listing/listing_sidebar/SubmitApplication.stories"

afterEach(cleanup)

describe("<ApplicationAddresses>", () => {
  it("renders in default state", () => {
    const { getByText } = render(<AllFields />)
    expect(getByText("Submit a Paper Application")).toBeTruthy()
    expect(getByText("Send Application by US Mail")).toBeTruthy()
    expect(getByText("Mailing Address Street")).toBeTruthy()
    expect(
      getByText(
        "Applications must be received by the deadline. If sending by U.S. Mail, the application must be postmarked by November 29th, 2021",
        { exact: false }
      )
    ).toBeTruthy()
    expect(getByText("or")).toBeTruthy()
    expect(getByText("Drop Off Application")).toBeTruthy()
    expect(getByText("Drop Off Address Street")).toBeTruthy()
    expect(getByText("Office Hours")).toBeTruthy()
  })
  it("renders with only dropoff address", () => {
    const { getByText, queryByText } = render(<DropOffNoOfficeHours />)
    expect(getByText("Submit a Paper Application")).toBeTruthy()
    expect(queryByText("Send Application by US Mail")).toBe(null)
    expect(queryByText("or")).toBe(null)
    expect(getByText("Drop Off Application")).toBeTruthy()
    expect(getByText("Drop Off Address Street")).toBeTruthy()
    expect(queryByText("Office Hours")).toBe(null)
  })
  it("renders with mailing address and no postmarks", () => {
    const { getByText, queryByText } = render(<MailingNoPostmarks />)
    expect(getByText("Submit a Paper Application")).toBeTruthy()
    expect(getByText("Send Application by US Mail")).toBeTruthy()
    expect(getByText("Mailing Address Street")).toBeTruthy()
    expect(
      getByText(
        "Applications must be received by the deadline and postmarks will not be considered."
      )
    ).toBeTruthy()
    expect(queryByText("or")).toBe(null)
    expect(queryByText("Drop Off Application")).toBe(null)
  })
  it("renders with mailing address and postmarks", () => {
    const { getByText, queryByText } = render(<MailingWithPostmarks />)
    expect(getByText("Submit a Paper Application")).toBeTruthy()
    expect(getByText("Send Application by US Mail")).toBeTruthy()
    expect(getByText("Mailing Address Street")).toBeTruthy()
    expect(
      getByText(
        "Applications must be received by the deadline. If sending by U.S. Mail, the application must be postmarked by November 29th, 2021",
        { exact: false }
      )
    ).toBeTruthy()
    expect(queryByText("or")).toBe(null)
    expect(queryByText("Drop Off Application")).toBe(null)
  })
})
