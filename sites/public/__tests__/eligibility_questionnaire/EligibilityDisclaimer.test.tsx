import { render, fireEvent, screen } from "@testing-library/react"
import EligibilityIncome from "../../pages/eligibility/income"
import React from "react"
import { act } from "react-dom/test-utils"
import userEvent from "@testing-library/user-event"
import EligibilityDisclaimer from "../../pages/eligibility/disclaimer"

const mockRouter = {
  push: jest.fn(),
}
jest.mock("next/router", () => ({
  useRouter() {
    return mockRouter
  },
}))

describe("<EligibilityDisclaimer>", () => {
  it("Renders Disclaimer page of eligibility questionnaire", () => {
    act(() => {
      render(<EligibilityDisclaimer />)
    })
    expect(screen.getByRole("heading", { name: "Disclaimer" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "View Listings" })).toBeInTheDocument()
  })

  it("Clicks the Finish button", async () => {
    await act(async () => {
      render(<EligibilityDisclaimer />)
      fireEvent.click(screen.getByRole("button", { name: "View Listings" }))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toContain("/listings")
  })
})
