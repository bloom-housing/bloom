import {
  render,
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import EligibilityAge from "../../pages/eligibility/age"
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

describe("<EligibilityAge>", () => {
  it("Renders Age page of eligibility questionnaire", () => {
    act(() => {
      render(<EligibilityAge />)
    })
    expect(screen.getByRole("heading", { name: "How old are you?" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument()
  })

  it("Displays an error message if no age has been entered", async () => {
    act(() => {
      render(<EligibilityAge />)
    })

    // No error message when we've just rendered the page
    expect(screen.queryByText("Please enter a valid age.")).not.toBeInTheDocument()

    await act(async () => {
      // Click "Next" with no age entered --> error message
      fireEvent.click(screen.getByRole("button", { name: "Next" }))
      await waitFor(() => screen.getByText("Please enter a valid age."))

      // Type in a valid age, wait for error message to go away
      userEvent.type(screen.getByRole("spinbutton", { name: "years old" }), "55")
      await waitForElementToBeRemoved(() => screen.queryByText("Please enter a valid age."))
    })
  })

  it("Displays an error message if an invalid age has been entered", async () => {
    act(() => {
      render(<EligibilityAge />)
    })

    // No error message when we've just rendered the page
    expect(screen.queryByText("Please enter a valid age.")).not.toBeInTheDocument()

    await act(async () => {
      // Type in an invalid age and click "Next" --> error message
      userEvent.type(screen.getByRole("spinbutton", { name: "years old" }), "555")
      fireEvent.click(screen.getByRole("button", { name: "Next" }))
      await waitFor(() => screen.getByText("Please enter a valid age."))
    })
  })

  it("Clicks the Next button", async () => {
    await act(async () => {
      render(<EligibilityAge />)
      userEvent.type(screen.getByRole("spinbutton", { name: "years old" }), "55")
      fireEvent.click(screen.getByRole("button", { name: "Next" }))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toBe("/eligibility/disability")
  })
})
