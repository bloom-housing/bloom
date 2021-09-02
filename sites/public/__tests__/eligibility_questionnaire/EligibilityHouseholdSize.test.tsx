import {
  render,
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import EligibilityHouseholdSize from "../../pages/eligibility/householdSize"
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
      screen.getByRole("heading", { name: "How many people will be living in this property?" })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument()
  })

  it("Clicks the Next button", async () => {
    await act(async () => {
      render(<EligibilityHouseholdSize />)
      userEvent.selectOptions(screen.getByRole("combobox"), "two")
      fireEvent.click(screen.getByRole("button", { name: "Next" }))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toBe("/eligibility/age")
  })
})
