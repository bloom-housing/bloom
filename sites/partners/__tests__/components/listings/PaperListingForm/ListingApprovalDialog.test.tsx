import React from "react"
import { cleanup, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import ListingApprovalDialog from "../../../../src/components/listings/PaperListingForm/dialogs/ListingApprovalDialog"
import { mockNextRouter, render } from "../../../testUtils"

describe("ListingApprovalDialog", () => {
  beforeAll(() => {
    mockNextRouter()
  })

  it("renders default approval copy", () => {
    render(
      <ListingApprovalDialog
        isOpen={true}
        setOpen={jest.fn()}
        submitFormWithStatus={jest.fn()}
        enableAutopublish={false}
      />
    )

    expect(screen.getByRole("heading", { name: "Are you sure?" })).toBeInTheDocument()
    expect(
      screen.getByText(/notify an administrator to review and approve the publication/)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(
        /This listing has no scheduled publish date and will go live immediately upon admin approval./
      )
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/this listing will publish automatically on/)).not.toBeInTheDocument()
  })

  it("renders scheduled publish copy when enableAutopublish is enabled with a valid scheduled date", () => {
    render(
      <ListingApprovalDialog
        isOpen={true}
        setOpen={jest.fn()}
        submitFormWithStatus={jest.fn()}
        enableAutopublish={true}
        scheduledPublishAt={new Date("2025-06-15T12:00:00.000Z")}
      />
    )

    expect(
      screen.getByText(
        /Pending admin approval, this listing will publish automatically on 06\/15\/2025 between 12:00 AM and 2:00 AM. If an admin approves after that date, it will publish immediately upon approval. To request changes to the publish date, contact an admin before approval./
      )
    ).toBeInTheDocument()
  })

  it("renders no-scheduled-date copy when enableAutopublish is enabled without a scheduled date", () => {
    render(
      <ListingApprovalDialog
        isOpen={true}
        setOpen={jest.fn()}
        submitFormWithStatus={jest.fn()}
        enableAutopublish={true}
        scheduledPublishAt={null}
      />
    )

    expect(
      screen.getByText(
        /This will notify an administrator to review and approve the publication of this listing. This listing has no scheduled publish date and will go live immediately upon admin approval./
      )
    ).toBeInTheDocument()
  })

  it("calls submitFormWithStatus and closes when confirming", async () => {
    const setOpen = jest.fn()
    const submitFormWithStatus = jest.fn()

    render(
      <ListingApprovalDialog
        isOpen={true}
        setOpen={setOpen}
        submitFormWithStatus={submitFormWithStatus}
      />
    )

    await userEvent.click(screen.getByRole("button", { name: "Submit" }))

    expect(setOpen).toHaveBeenCalledWith(false)
    expect(submitFormWithStatus).toHaveBeenCalledTimes(1)
    expect(submitFormWithStatus).toHaveBeenCalledWith("redirect", ListingsStatusEnum.pendingReview)
  })

  it("closes without submitting when cancel is clicked", async () => {
    const setOpen = jest.fn()
    const submitFormWithStatus = jest.fn()

    render(
      <ListingApprovalDialog
        isOpen={true}
        setOpen={setOpen}
        submitFormWithStatus={submitFormWithStatus}
      />
    )

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }))

    expect(setOpen).toHaveBeenCalledWith(false)
    expect(submitFormWithStatus).not.toHaveBeenCalled()
  })
})
