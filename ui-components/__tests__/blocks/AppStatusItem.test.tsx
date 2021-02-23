import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { AppStatusItem } from "../../src/blocks/AppStatusItem"
import { Application, Listing } from "@bloom-housing/backend-core/types"
import { ArcherListing } from "@bloom-housing/backend-core/types/src/archer-listing"
import moment from "moment"
import { t } from "../../src/helpers/translator"

const listing = Object.assign({}, ArcherListing) as Listing
const application = {} as Application

afterEach(cleanup)

describe("<AppStatusItem>", () => {
  it("for an in progress application", () => {
    const setDeletingApplicationSpy = jest.fn()
    listing.applicationDueDate = new Date(moment().add(10, "days").format())
    const { getByText, queryByText } = render(
      <AppStatusItem
        application={application}
        listing={listing}
        status={"inProgress"}
        setDeletingApplication={setDeletingApplicationSpy}
      />
    )

    expect(getByText(listing.name)).not.toBeNull()
    expect(getByText(listing.applicationAddress.street, { exact: false })).not.toBeNull()
    expect(getByText(t("listings.applicationDeadline"), { exact: false })).not.toBeNull()
    expect(getByText(t("application.statuses.inProgress"), { exact: false })).not.toBeNull()
    expect(getByText(t("t.delete"))).not.toBeNull()

    // Don't show confirmation number if a lottery number wasn't given
    expect(queryByText(t("application.yourLotteryNumber"))).toBeNull()

    fireEvent.click(getByText(t("t.delete")))
    expect(setDeletingApplicationSpy).toHaveBeenCalledTimes(1)
  })

  it("for a never submitted application", () => {
    const setDeletingApplicationSpy = jest.fn()
    const { getByText, queryByText } = render(
      <AppStatusItem
        application={application}
        listing={listing}
        status={"neverSubmitted"}
        setDeletingApplication={setDeletingApplicationSpy}
      />
    )

    expect(getByText(listing.name)).not.toBeNull()
    expect(getByText(listing.applicationAddress.street, { exact: false })).not.toBeNull()
    expect(getByText(t("listings.applicationDeadline"), { exact: false })).not.toBeNull()
    expect(getByText(t("application.statuses.neverSubmitted"), { exact: false })).not.toBeNull()
    expect(getByText(t("t.delete"))).not.toBeNull()

    // Don't show confirmation number if a lottery number wasn't given
    expect(queryByText(t("application.yourLotteryNumber"))).toBeNull()

    fireEvent.click(getByText(t("t.delete")))
    expect(setDeletingApplicationSpy).toHaveBeenCalledTimes(1)
  })

  it("for a submitted application", () => {
    const setDeletingApplicationSpy = jest.fn()
    const { getByText, queryByText } = render(
      <AppStatusItem
        application={application}
        listing={listing}
        status={"submitted"}
        setDeletingApplication={setDeletingApplicationSpy}
      />
    )

    expect(getByText(listing.name)).not.toBeNull()
    expect(getByText(listing.applicationAddress.street, { exact: false })).not.toBeNull()
    expect(getByText(t("listings.applicationDeadline"), { exact: false })).not.toBeNull()
    expect(getByText(t("application.statuses.submitted"), { exact: false })).not.toBeNull()
    expect(queryByText(t("t.delete"))).toBeNull()

    // Don't show confirmation number if a lottery number wasn't given
    expect(queryByText(t("application.yourLotteryNumber"))).toBeNull()
  })

  it("optionally renders confirmation number", () => {
    const setDeletingApplicationSpy = jest.fn()
    const { getByText, queryByText } = render(
      <AppStatusItem
        application={application}
        listing={listing}
        status={"submitted"}
        setDeletingApplication={setDeletingApplicationSpy}
        lotteryNumber={"1234abcd"}
      />
    )

    expect(getByText(listing.name)).not.toBeNull()
    expect(getByText(listing.applicationAddress.street, { exact: false })).not.toBeNull()
    expect(getByText(t("listings.applicationDeadline"), { exact: false })).not.toBeNull()
    expect(getByText(t("application.statuses.submitted"), { exact: false })).not.toBeNull()
    expect(queryByText(t("t.delete"))).toBeNull()

    expect(getByText(t("application.yourLotteryNumber"), { exact: false })).not.toBeNull()
    expect(getByText("1234abcd", { exact: false })).not.toBeNull()
  })
})
