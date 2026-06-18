import React from "react"
import { cleanup, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import PublishListingDialog from "../../../../src/components/listings/PaperListingForm/dialogs/PublishListingDialog"
import { mockNextRouter, render } from "../../../testUtils"

dayjs.extend(utc)

afterEach(cleanup)

describe("PublishListingDialog", () => {
  beforeAll(() => {
    mockNextRouter()
  })

  it("renders default publish copy when enableAutopublish is false", () => {
    render(
      <PublishListingDialog
        isOpen={true}
        setOpen={jest.fn()}
        submitFormWithStatus={jest.fn()}
        enableAutopublish={false}
        scheduledPublishAt={new Date("2026-06-15T00:00:00.000Z")}
      />
    )

    expect(screen.getByRole("heading", { name: "Are you sure?" })).toBeInTheDocument()
    expect(
      screen.getByText("Publishing will push the listing live on the public site.")
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument()
    expect(screen.queryByText(/publish automatically/)).not.toBeInTheDocument()
  })

  it("renders default publish copy when enableAutopublish is true but no scheduled date", () => {
    render(
      <PublishListingDialog
        isOpen={true}
        setOpen={jest.fn()}
        submitFormWithStatus={jest.fn()}
        enableAutopublish={true}
        scheduledPublishAt={null}
      />
    )

    expect(
      screen.getByText("Publishing will push the listing live on the public site.")
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument()
    expect(screen.queryByText(/publish automatically/)).not.toBeInTheDocument()
  })

  it("renders default publish copy when enableAutopublish is true but scheduled date is in the past", () => {
    jest.useFakeTimers("modern")
    jest.setSystemTime(new Date("2026-06-16T00:00:01"))

    render(
      <PublishListingDialog
        isOpen={true}
        setOpen={jest.fn()}
        submitFormWithStatus={jest.fn()}
        enableAutopublish={true}
        scheduledPublishAt={new Date("2026-06-15T00:00:00.000Z")}
      />
    )

    expect(
      screen.getByText("Publishing will push the listing live on the public site.")
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument()
    expect(screen.queryByText(/publish automatically/)).not.toBeInTheDocument()
    jest.useRealTimers()
  })

  it("renders scheduled publish copy when enableAutopublish is true with a valid future scheduled date", () => {
    jest.useFakeTimers("modern")
    jest.setSystemTime(new Date("2026-06-14T23:30:00"))

    render(
      <PublishListingDialog
        isOpen={true}
        setOpen={jest.fn()}
        submitFormWithStatus={jest.fn()}
        enableAutopublish={true}
        scheduledPublishAt={new Date("2026-06-15T00:00:00.000Z")}
      />
    )

    expect(screen.getByRole("heading", { name: "Are you sure?" })).toBeInTheDocument()
    expect(
      screen.getByText(
        "This listing will publish automatically on 06/15/2026 between 12:00 AM and 2:00 AM."
      )
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Publish" })).not.toBeInTheDocument()
    jest.useRealTimers()
  })

  it("submits with scheduled status when confirming with a future scheduled date", async () => {
    const setOpen = jest.fn()
    const submitFormWithStatus = jest.fn()

    render(
      <PublishListingDialog
        isOpen={true}
        setOpen={setOpen}
        submitFormWithStatus={submitFormWithStatus}
        enableAutopublish={true}
        scheduledPublishAt={new Date("2099-12-31T00:00:00.000Z")}
      />
    )

    await userEvent.click(screen.getByRole("button", { name: "Submit" }))

    expect(setOpen).toHaveBeenCalledWith(false)
    expect(submitFormWithStatus).toHaveBeenCalledWith("redirect", ListingsStatusEnum.scheduled)
  })

  it("submits with active status when confirming without a scheduled date", async () => {
    const setOpen = jest.fn()
    const submitFormWithStatus = jest.fn()

    render(
      <PublishListingDialog
        isOpen={true}
        setOpen={setOpen}
        submitFormWithStatus={submitFormWithStatus}
        enableAutopublish={false}
      />
    )

    await userEvent.click(screen.getByRole("button", { name: "Publish" }))

    expect(setOpen).toHaveBeenCalledWith(false)
    expect(submitFormWithStatus).toHaveBeenCalledWith("redirect", ListingsStatusEnum.active)
  })

  it("closes without submitting when cancel is clicked", async () => {
    const setOpen = jest.fn()
    const submitFormWithStatus = jest.fn()

    render(
      <PublishListingDialog
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
