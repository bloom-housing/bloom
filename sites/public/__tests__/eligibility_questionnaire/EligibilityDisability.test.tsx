import { render, fireEvent, screen } from "@testing-library/react"
import EligibilityDisability from "../../src/pages/eligibility/disability"
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
    expect(
      screen.getAllByText("Does anyone in your household have a disability?").length
    ).toBeTruthy()
    expect(screen.getByText("Next")).toBeInTheDocument()
  })

  it("Does not display an error message if no selection has been made", async () => {
    act(() => {
      render(<EligibilityDisability />)
    })

    // No error message when we've just rendered the page
    expect(screen.queryByText("Please select one of the options above.")).not.toBeInTheDocument()

    await act(async () => {
      // Click "Next" with no selection made --> no error message
      fireEvent.click(screen.getByText("Next"))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toBe("/eligibility/accessibility")
  })

  it("Clicks the Next button", async () => {
    await act(async () => {
      render(<EligibilityDisability />)
      fireEvent.click(screen.getByText("No"))
      fireEvent.click(screen.getByText("Next"))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toBe("/eligibility/accessibility")
  })

  it("Clicks the See results now button", async () => {
    await act(async () => {
      render(<EligibilityDisability />)
      fireEvent.click(screen.getByText("See results now"))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toContain("/listings")
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
