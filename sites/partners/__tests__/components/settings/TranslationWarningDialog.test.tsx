import React from "react"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { mockNextRouter, render } from "../../testUtils"
import { TranslationWarningDialog } from "../../../src/components/settings/TranslationWarningDialog"

beforeAll(() => mockNextRouter())

const tokenIssue = (key: string, missingTokens: string[], missingPluralForms = false) => ({
  key,
  missingTokens,
  missingPluralForms,
})

const renderDialog = (props = {}) =>
  render(
    <TranslationWarningDialog
      hidingKeys={["listings.petPolicyDescription", "account.settings.disclaimer"]}
      tokenIssues={[]}
      isLoading={false}
      onClose={jest.fn()}
      onConfirm={jest.fn()}
      {...props}
    />
  )

describe("<TranslationWarningDialog>", () => {
  describe("hidden sections", () => {
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
  })

  describe("dropped placeholders", () => {
    it("names the key and the placeholders it no longer uses", () => {
      renderDialog({
        hidingKeys: [],
        tokenIssues: [tokenIssue("account.greeting", ["name", "count"])],
      })

      expect(screen.getByText("account.greeting (%{name}, %{count})")).toBeInTheDocument()
    })

    it("names a dropped plural form alongside the placeholders", () => {
      renderDialog({
        hidingKeys: [],
        tokenIssues: [tokenIssue("listings.unitCount", ["smart_count"], true)],
      })

      expect(
        screen.getByText("listings.unitCount (%{smart_count}, plural form)")
      ).toBeInTheDocument()
    })

    it("lets the admin save anyway, rather than blocking", async () => {
      const onConfirm = jest.fn()
      renderDialog({
        hidingKeys: [],
        tokenIssues: [tokenIssue("account.greeting", ["name"])],
        onConfirm,
      })

      await userEvent.click(screen.getByRole("button", { name: "Confirm" }))

      expect(onConfirm).toHaveBeenCalled()
    })
  })

  describe("both warnings at once", () => {
    it("shows one dialog covering both rather than asking twice", () => {
      renderDialog({
        hidingKeys: ["listings.petPolicyDescription"],
        tokenIssues: [tokenIssue("account.greeting", ["name"])],
      })

      expect(screen.getAllByRole("dialog")).toHaveLength(1)
      expect(screen.getByText("listings.petPolicyDescription")).toBeInTheDocument()
      expect(screen.getByText("account.greeting (%{name})")).toBeInTheDocument()
    })
  })

  describe("actions", () => {
    it("stays closed when there is nothing to warn about", () => {
      renderDialog({ hidingKeys: [], tokenIssues: [] })

      expect(screen.queryByRole("dialog")).toBeNull()
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
})
