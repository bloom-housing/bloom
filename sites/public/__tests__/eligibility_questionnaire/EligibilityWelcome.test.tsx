import { render, fireEvent, screen } from "@testing-library/react"
import EligibilityWelcome from "../../src/pages/eligibility/welcome"
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

describe("<EligibilityWelcome>", () => {
  it("Renders welcome page of eligibility questionnaire", () => {
    act(() => {
      render(<EligibilityWelcome />)
    })
    expect(screen.getAllByText("Welcome").length).toBeTruthy()
    expect(screen.getByText("Next")).toBeInTheDocument()
  })

  it("Click Next button", async () => {
    await act(async () => {
      render(<EligibilityWelcome />)
      fireEvent.click(screen.getByText("Next"))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toBe("/eligibility/household")
  })
})
