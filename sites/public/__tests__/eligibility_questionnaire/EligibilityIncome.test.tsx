import { render, fireEvent, screen } from "@testing-library/react"
import EligibilityIncome from "../../src/pages/eligibility/income"
import React from "react"
import { act } from "react-dom/test-utils"

const mockRouter = {
  push: jest.fn(),
}
jest.mock("next/router", () => ({
  useRouter() {
    return mockRouter
  },
}))

describe("<EligibilityIncome>", () => {
  it("Renders Income page of eligibility questionnaire", () => {
    act(() => {
      render(<EligibilityIncome />)
    })
    expect(
      screen.getByText(
        "What is the estimated total annual income for everyone who will live with you, including yourself?"
      )
    ).toBeInTheDocument()
    expect(screen.getByText("See results now")).toBeInTheDocument()
  })

  it("Clicks the See results now button", async () => {
    await act(async () => {
      render(<EligibilityIncome />)
      fireEvent.click(screen.getByText("$10,000 - $19,999"))
      fireEvent.click(screen.getByText("See results now"))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toContain("/listings")
  })
})
