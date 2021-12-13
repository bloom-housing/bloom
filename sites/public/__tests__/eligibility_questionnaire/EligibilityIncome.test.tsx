import { render, fireEvent, screen } from "@testing-library/react"
import EligibilityIncome from "../../pages/eligibility/income"
import React from "react"
import { act } from "react-dom/test-utils"
import userEvent from "@testing-library/user-event"

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
    expect(screen.getByRole("button", { name: "Finish" })).toBeInTheDocument()
  })

  it("Clicks the Finish button", async () => {
    await act(async () => {
      render(<EligibilityIncome />)
      userEvent.selectOptions(screen.getByRole("combobox"), "10kTo20k")
      fireEvent.click(screen.getByRole("button", { name: "Finish" }))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toContain("/eligibility/disclaimer")
  })
})
