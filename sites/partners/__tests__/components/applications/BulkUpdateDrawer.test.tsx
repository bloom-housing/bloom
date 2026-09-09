import React from "react"
import userEvent from "@testing-library/user-event"
import { BackgroundJobStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import BulkUpdateDrawer from "../../../src/components/applications/BulkUpdateDrawer"
import { mockNextRouter, render, screen, within } from "../../testUtils"

beforeAll(() => mockNextRouter())

const defaultProps = {
  isOpen: true,
  listingId: "test-listing-id",
  jobId: null,
  setJobId: jest.fn(),
  onClose: jest.fn(),
}

describe("BulkUpdateDrawer", () => {
  it("renders drawer when open", () => {
    render(<BulkUpdateDrawer {...defaultProps} />)
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Bulk update applications")).toBeInTheDocument()
  })

  it("does not render drawer when closed", () => {
    render(<BulkUpdateDrawer {...defaultProps} isOpen={false} />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("calls onClose when Close button is clicked", async () => {
    const onClose = jest.fn()
    render(<BulkUpdateDrawer {...defaultProps} onClose={onClose} />)
    const footer = screen.getByRole("contentinfo")
    await userEvent.click(within(footer).getByRole("button", { name: "Close" }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("renders all three steps", () => {
    render(<BulkUpdateDrawer {...defaultProps} />)
    expect(screen.getByText("Step 1: Download the template")).toBeInTheDocument()
    expect(screen.getByText("Step 2: Make your changes")).toBeInTheDocument()
    expect(screen.getByText("Step 3: Upload your file")).toBeInTheDocument()
  })

  it("renders the download template button", () => {
    render(<BulkUpdateDrawer {...defaultProps} />)
    expect(screen.getByRole("button", { name: /download template/i })).toBeInTheDocument()
  })

  it("renders the CSV dropzone", () => {
    render(<BulkUpdateDrawer {...defaultProps} />)
    expect(screen.getByText("Upload CSV")).toBeInTheDocument()
  })

  it("disables the upload button while no file has been uploaded", () => {
    render(<BulkUpdateDrawer {...defaultProps} />)
    expect(screen.getByRole("button", { name: "Upload file" })).toBeDisabled()
  })

  it("reports the outcome in place once the job has completed", () => {
    render(<BulkUpdateDrawer {...defaultProps} jobStatus={BackgroundJobStatusEnum.completed} />)
    expect(screen.getByText("Your file has been processed successfully.")).toBeInTheDocument()
  })

  it("reports a failed job in place", () => {
    render(<BulkUpdateDrawer {...defaultProps} jobStatus={BackgroundJobStatusEnum.failed} />)
    expect(
      screen.getByText("An error has occurred during the processing of the CSV file")
    ).toBeInTheDocument()
  })
})
