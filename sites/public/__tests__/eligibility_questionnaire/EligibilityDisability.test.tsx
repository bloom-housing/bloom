import { render, fireEvent, screen, waitFor } from "@testing-library/react"
import EligibilityDisability from "../../pages/eligibility/disability"
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

describe("<EligibilityDisability>", () => {
  it("Renders Disability page of eligibility questionnaire", () => {
    act(() => {
      render(<EligibilityDisability />)
    })
    expect(screen.getByRole("heading", { name: "Does anyone in your household have a disability?" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument()
  })

  it("Does not display an error message if no selection has been made", async () => {
    act(() => {
      render(<EligibilityDisability />)
    })

    // No error message when we've just rendered the page
    expect(screen.queryByText("Please select one of the options above.")).not.toBeInTheDocument()

    await act(async () => {
      // Click "Next" with no selection made --> no error message
      fireEvent.click(screen.getByRole("button", { name: "Next" }))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toBe("/eligibility/income")
  })

  it("Clicks the Next button", async () => {
    await act(async () => {
      render(<EligibilityDisability />)
      fireEvent.click(screen.getByRole("radio", { name: "No" }))
      fireEvent.click(screen.getByRole("button", { name: "Next" }))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toBe("/eligibility/income")
  })

  it("Clicks the Finish button", async () => {
    await act(async () => {
      render(<EligibilityDisability />)
      fireEvent.click(screen.getByRole("button", { name: "Finish" }))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toBe("/eligibility/disclaimer")
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
