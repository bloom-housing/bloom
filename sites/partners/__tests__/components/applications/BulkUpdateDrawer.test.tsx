import React from "react"
import userEvent from "@testing-library/user-event"
import BulkUpdateDrawer from "../../../src/components/applications/BulkUpdateDrawer"
import { mockNextRouter, render, screen, within } from "../../testUtils"

beforeAll(() => mockNextRouter())

describe("BulkUpdateDrawer", () => {
  it("renders drawer when open", () => {
    render(<BulkUpdateDrawer isOpen={true} onClose={jest.fn()} />)
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Bulk update applications")).toBeInTheDocument()
  })

  it("does not render drawer when closed", () => {
    render(<BulkUpdateDrawer isOpen={false} onClose={jest.fn()} />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("calls onClose when Close button is clicked", async () => {
    const onClose = jest.fn()
    render(<BulkUpdateDrawer isOpen={true} onClose={onClose} />)
    const footer = screen.getByRole("contentinfo")
    await userEvent.click(within(footer).getByRole("button", { name: "Close" }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("renders all three steps", () => {
    render(<BulkUpdateDrawer isOpen={true} onClose={jest.fn()} />)
    expect(screen.getByText("Step 1: Download the template")).toBeInTheDocument()
    expect(screen.getByText("Step 2: Make your changes")).toBeInTheDocument()
    expect(screen.getByText("Step 3: Upload your file")).toBeInTheDocument()
  })

  it("renders the download template button", () => {
    render(<BulkUpdateDrawer isOpen={true} onClose={jest.fn()} />)
    expect(screen.getByRole("button", { name: /download template/i })).toBeInTheDocument()
  })

  it("renders the CSV dropzone", () => {
    render(<BulkUpdateDrawer isOpen={true} onClose={jest.fn()} />)
    expect(screen.getByText("Upload CSV")).toBeInTheDocument()
  })
})
