import {
  render,
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import EligibilityHouseholdSize from "../../pages/eligibility/household"
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

describe("<EligibilityHouseholdSize>", () => {
  it("Renders household size page of eligibility questionnaire", () => {
    act(() => {
      render(<EligibilityHouseholdSize />)
    })
    expect(
      screen.getAllByText("How many people will live in your next rental, including yourself?")
        .length
    ).toBeTruthy()
    expect(screen.getByText("Next")).toBeInTheDocument()
  })

  it("Clicks the Next button", async () => {
    await act(async () => {
      render(<EligibilityHouseholdSize />)
      userEvent.selectOptions(screen.getByLabelText("Household Size"), "two")
      fireEvent.click(screen.getByText("Next"))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toBe("/eligibility/age")
  })

  it("Clicks the See results now button", async () => {
    await act(async () => {
      render(<EligibilityHouseholdSize />)
      userEvent.selectOptions(screen.getByLabelText("Household Size"), "two")
      fireEvent.click(screen.getByText("See results now"))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toContain("/listings")
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
