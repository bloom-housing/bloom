import React from "react"
import { render, cleanup } from "@testing-library/react"
import { AllFields } from "../../src/page_components/listing/listing_sidebar/SubmitApplication.stories"

afterEach(cleanup)

describe("<SubmitApplication>", () => {
  it("includes mailing address, includes drop off address, includes due date, includes postmarks, includes office hours", () => {
    const { getByText } = render(<AllFields />)
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
