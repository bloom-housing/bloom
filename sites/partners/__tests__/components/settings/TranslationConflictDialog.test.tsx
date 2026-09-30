import React from "react"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { mockNextRouter, render } from "../../testUtils"
import { TranslationConflictDialog } from "../../../src/components/settings/TranslationConflictDialog"

const conflicts = [
  { key: "region.name", mine: "Springfield", theirs: "Shelbyville" },
  { key: "t.hello", mine: "Howdy", theirs: "Hello there" },
]

beforeAll(() => mockNextRouter())

const renderDialog = (props = {}) =>
  render(
    <TranslationConflictDialog
      conflicts={conflicts}
      isLoading={false}
      onClose={jest.fn()}
      onResolve={jest.fn()}
      {...props}
    />
  )

describe("<TranslationConflictDialog>", () => {
  it("lists every conflicting key with both values", () => {
    renderDialog()

    expect(screen.getByText("region.name")).toBeInTheDocument()
    expect(screen.getByText("Springfield")).toBeInTheDocument()
    expect(screen.getByText("Shelbyville")).toBeInTheDocument()
    expect(screen.getByText("t.hello")).toBeInTheDocument()
    expect(screen.getByText("Howdy")).toBeInTheDocument()
    expect(screen.getByText("Hello there")).toBeInTheDocument()
  })

  it("defaults every key to keeping the admin's value so dismissing loses nothing", () => {
    renderDialog()

    const keepMine = screen.getAllByRole("radio", { name: "Keep your value" })
    const takeTheirs = screen.getAllByRole("radio", { name: "Use the saved value" })

    expect(keepMine).toHaveLength(2)
    keepMine.forEach((radio) => expect(radio).toBeChecked())
    takeTheirs.forEach((radio) => expect(radio).not.toBeChecked())
  })

  it("groups the radios per key, so a choice on one does not change the other", async () => {
    renderDialog()

    await userEvent.click(screen.getAllByRole("radio", { name: "Use the saved value" })[0])

    expect(screen.getAllByRole("radio", { name: "Use the saved value" })[0]).toBeChecked()
    expect(screen.getAllByRole("radio", { name: "Keep your value" })[1]).toBeChecked()
  })

  it("reports the per-key choices when applied", async () => {
    const onResolve = jest.fn()
    renderDialog({ onResolve })

    await userEvent.click(screen.getAllByRole("radio", { name: "Use the saved value" })[1])
    await userEvent.click(screen.getByRole("button", { name: "Apply" }))

    expect(onResolve).toHaveBeenCalledWith({ "region.name": "mine", "t.hello": "theirs" })
  })

  it("labels an empty value rather than rendering nothing", () => {
    renderDialog({ conflicts: [{ key: "a.key", mine: "", theirs: "Stored" }] })

    expect(screen.getByText("(empty)")).toBeInTheDocument()
  })

  it("closes without resolving when cancelled", async () => {
    const onClose = jest.fn()
    const onResolve = jest.fn()
    renderDialog({ onClose, onResolve })

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }))

    expect(onClose).toHaveBeenCalled()
    expect(onResolve).not.toHaveBeenCalled()
  })

  it("disables both actions while a save is in flight", () => {
    renderDialog({ isLoading: true })

    expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled()
  })
})
