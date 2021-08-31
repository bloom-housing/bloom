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
      screen.getByRole("heading", { name: "What is your total household annual income?" })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument()
  })

  it("Clicks the Done button", async () => {
    await act(async () => {
      render(<EligibilityIncome />)
      userEvent.selectOptions(screen.getByRole("combobox"), "10kTo20k")
      fireEvent.click(screen.getByRole("button", { name: "Done" }))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toContain("/listings")
  })
})
