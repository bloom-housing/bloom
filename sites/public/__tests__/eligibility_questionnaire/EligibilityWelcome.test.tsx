import { render } from "@testing-library/react"
import EligibilityWelcome from "../../pages/eligibility/welcome"
import React from "react"

describe("<EligibilityWelcome>", () => {
  it("Renders welcome page of eligibility questionnaire", () => {
    const { getAllByText } = render(<EligibilityWelcome />)
    expect(getAllByText("Welcome")).toBeTruthy()
    expect(getAllByText("Next")).toBeTruthy()
  })
})
