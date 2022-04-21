import React from "react"
import { render, cleanup } from "@testing-library/react"
import {
  AllFields,
  DropOffNoOfficeHours,
} from "../../src/page_components/listing/listing_sidebar/SubmitApplication.stories"

afterEach(cleanup)

describe("<SubmitApplication>", () => {
  it("includes mailing address, includes drop off address, includes due date, includes postmarks, includes office hours", () => {
    const { getByText } = render(<AllFields />)
    expect(getByText("Submit a Paper Application")).toBeTruthy()
    expect(getByText("Send Application by US Mail")).toBeTruthy()
    expect(getByText("Mailing Address Street", { exact: false })).toBeTruthy()
    expect(
      getByText(
        "Applications must be received by the deadline. If sending by U.S. Mail, the application must be postmarked by November 29th, 2021",
        { exact: false }
      )
    ).toBeTruthy()
    expect(getByText("or")).toBeTruthy()
    expect(getByText("Drop Off Application")).toBeTruthy()
    expect(getByText("Drop Off Address Street", { exact: false })).toBeTruthy()
    expect(getByText("Office Hours")).toBeTruthy()
  })
})
