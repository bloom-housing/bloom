import React from "react"
import { t } from "@bloom-housing/ui-components"
import { fireEvent, mockNextRouter, render, screen, waitFor } from "../testUtils"
import { CreateAdvocateAccountConfirmation } from "../../src/pages/create-advocate-account-confirmation"

beforeAll(() => {
  mockNextRouter()
  window.scrollTo = jest.fn()
})

describe("Create advocate account confirmation page", () => {
  it("renders all page content", () => {
    render(<CreateAdvocateAccountConfirmation />)

    expect(
      screen.getByRole("heading", {
        name: t("authentication.requestAdvocateAccount.confirmationTitle"),
        level: 1,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByText(t("authentication.requestAdvocateAccount.confirmation"))
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: t("t.ok") })).toBeInTheDocument()
  })

  it("navigates to home when clicking ok", async () => {
    const { pushMock } = mockNextRouter()
    render(<CreateAdvocateAccountConfirmation />)

    fireEvent.click(screen.getByRole("button", { name: t("t.ok") }))

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/")
    })
  })
})
