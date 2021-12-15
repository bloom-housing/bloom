import { render, fireEvent, screen } from "@testing-library/react"
import EligibilityIncome from "../../pages/eligibility/income"
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
      screen.getByRole("heading", {
        name:
          "What is the estimated total annual income for everyone who will live with you, including yourself?",
      })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "See results now" })).toBeInTheDocument()
  })

  it("Clicks the See results now button", async () => {
    await act(async () => {
      render(<EligibilityIncome />)
      fireEvent.click(screen.getByRole("radio", { name: "$10,000 - $19,999" }))
      fireEvent.click(screen.getByRole("button", { name: "See results now" }))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toContain("/listings")
  })
})
