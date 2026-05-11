import React from "react"
import { cleanup, screen } from "@testing-library/react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import AdminListingApprovalDialog from "../../../../src/components/listings/PaperListingForm/dialogs/AdminListingApprovalDialog"
import { mockNextRouter, render } from "../../../testUtils"

dayjs.extend(utc)

afterEach(cleanup)

describe("AdminListingApprovalDialog", () => {
  beforeAll(() => {
    mockNextRouter()
  })

  beforeEach(() => {
    jest.useFakeTimers("modern")
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("renders no-scheduled-date body copy when scheduledPublishAt is null", () => {
    render(
      <AdminListingApprovalDialog
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        scheduledPublishAt={null}
      />
    )

    expect(screen.getByRole("heading", { name: "Approve listing" })).toBeInTheDocument()
    expect(
      screen.getByText(
        "This listing has no scheduled publish date entered. Approving it will publish it immediately. To delay publication, set a publish date before approving."
      )
    ).toBeInTheDocument()
  })

  it("renders future-scheduled body copy when publish window has not ended", () => {
    jest.setSystemTime(dayjs.utc("2026-06-14T23:00:00.000Z").toDate())
    render(
      <AdminListingApprovalDialog
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        scheduledPublishAt={"2026-06-15T00:00:00.000Z"}
      />
    )

    expect(
      screen.getByText(
        "This listing is scheduled to publish automatically on 06/15/2026 between 12:00 AM and 2:00 AM. Approving now will not publish it immediately."
      )
    ).toBeInTheDocument()
  })

  it("renders past-scheduled body copy when publish window has ended", () => {
    jest.setSystemTime(dayjs.utc("2026-06-15T00:00:01.000Z").toDate())

    render(
      <AdminListingApprovalDialog
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        scheduledPublishAt={"2026-06-15T00:00:00.000Z"}
      />
    )

    expect(
      screen.getByText(
        "The scheduled publish date entered on the listing has passed. Approving this listing will publish it immediately. To delay publication, update the scheduled publish date before approving."
      )
    ).toBeInTheDocument()
  })
})
