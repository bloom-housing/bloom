import React from "react"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { mockNextRouter, render } from "../../testUtils"
import { TranslationHideSectionDialog } from "../../../src/components/settings/TranslationHideSectionDialog"

beforeAll(() => mockNextRouter())

const renderDialog = (props = {}) =>
  render(
    <TranslationHideSectionDialog
      keys={["listings.petPolicyDescription", "account.settings.disclaimer"]}
      isLoading={false}
      onClose={jest.fn()}
      onConfirm={jest.fn()}
      {...props}
    />
  )

describe("<TranslationHideSectionDialog>", () => {
  it("names every key whose section would stop appearing", () => {
    renderDialog()

    expect(screen.getByText("listings.petPolicyDescription")).toBeInTheDocument()
    expect(screen.getByText("account.settings.disclaimer")).toBeInTheDocument()
  })

  it("says what will happen rather than only asking for confirmation", () => {
    renderDialog()

    expect(
      screen.getByText(/sections they fill will stop appearing on the public site/i)
    ).toBeInTheDocument()
  })

  it("confirms only on the confirm action", async () => {
    const onConfirm = jest.fn()
    const onClose = jest.fn()
    renderDialog({ onConfirm, onClose })

    await userEvent.click(screen.getByRole("button", { name: "Confirm" }))

    expect(onConfirm).toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
  })

  it("closes without confirming when cancelled", async () => {
    const onConfirm = jest.fn()
    const onClose = jest.fn()
    renderDialog({ onConfirm, onClose })

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }))

    expect(onClose).toHaveBeenCalled()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it("disables both actions while the request is in flight", () => {
    renderDialog({ isLoading: true })

    expect(screen.getByRole("button", { name: "Confirm" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled()
  })
})
