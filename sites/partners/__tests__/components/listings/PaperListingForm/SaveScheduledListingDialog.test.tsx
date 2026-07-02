import React from "react"
import { screen } from "@testing-library/react"
import SaveScheduledListingDialog from "../../../../src/components/listings/PaperListingForm/dialogs/SaveScheduledListingDialog"
import { mockNextRouter, render } from "../../../testUtils"

describe("SaveScheduledListingDialog", () => {
  beforeAll(() => {
    mockNextRouter()
  })

  beforeEach(() => {
    jest.useFakeTimers("modern")
    jest.setSystemTime(new Date("2026-06-15T12:00:00.000Z"))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("renders no-date copy when currentScheduledPublishAt is null", () => {
    render(
      <SaveScheduledListingDialog
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        currentScheduledPublishAt={null}
      />
    )

    expect(
      screen.getByText(
        "This listing no longer has a scheduled publish date entered. As it is already approved, saving will publish it immediately. To delay publication, set a publish date before saving, or Unapprove the listing."
      )
    ).toBeInTheDocument()
  })

  it("renders past-date copy when currentScheduledPublishAt is in the past", () => {
    render(
      <SaveScheduledListingDialog
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        currentScheduledPublishAt={new Date("2026-06-14T00:00:00.000Z")}
      />
    )

    expect(
      screen.getByText(
        "The scheduled publish date entered on this listing is in the past. As it is already approved, saving will publish it immediately. To delay publication, update the scheduled publish date before saving, or Unapprove the listing."
      )
    ).toBeInTheDocument()
  })

  it("renders scheduled copy with formatted date when currentScheduledPublishAt is in the future", () => {
    render(
      <SaveScheduledListingDialog
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        currentScheduledPublishAt={new Date("2026-06-20T00:00:00.000Z")}
      />
    )

    expect(
      screen.getByText(
        "This listing is approved and scheduled to publish on 06/20/2026 between 12:00 AM and 2:00 AM. Saving will not affect its scheduled publication on this date."
      )
    ).toBeInTheDocument()
  })
})
