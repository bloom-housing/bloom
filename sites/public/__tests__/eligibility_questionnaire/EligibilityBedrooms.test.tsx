import {
  render,
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import EligibilityBedrooms from "../../pages/eligibility/bedrooms"
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

describe("<EligibilityBedrooms>", () => {
  it("Renders bedrooms page of eligibility questionnaire", () => {
    act(() => {
      render(<EligibilityBedrooms />)
    })
    expect(
      screen.getByRole("heading", { name: "How many bedrooms do you need?" })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument()
  })

  it("Displays an error message if no bedroom counts have been selected", async () => {
    act(() => {
      render(<EligibilityBedrooms />)
    })

    // No error message when we've just rendered the page
    expect(screen.queryByText("Please select at least one option.")).not.toBeInTheDocument()

    await act(async () => {
      // Click "Next" --> error message
      fireEvent.click(screen.getByRole("button", { name: "Next" }))
      await waitFor(() => screen.getByText("Please select at least one option."))

      // Click one of the bedroom options, wait for error message to go away
      fireEvent.click(screen.getByDisplayValue("threeBdrm"))
      await waitForElementToBeRemoved(() =>
        screen.queryByText("Please select at least one option.")
      )
    })
  })

  it("Clicks the Next button", async () => {
    await act(async () => {
      render(<EligibilityBedrooms />)
      fireEvent.click(screen.getByDisplayValue("threeBdrm"))
      fireEvent.click(screen.getByRole("button", { name: "Next" }))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toBe("/eligibility/age")
  })
})
