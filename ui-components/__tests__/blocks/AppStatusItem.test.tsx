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
  it("renders properly for an in progress application", () => {
    listing.applicationDueDate = new Date(moment().add(10, "days").format())
    const { getByText, queryByText } = render(
      <AppStatusItem application={application} listing={listing} />
    )

    expect(getByText(listing.name)).not.toBeNull()
    expect(getByText(t("listings.applicationDeadline"), { exact: false })).not.toBeNull()

    // Don't show confirmation number if a lottery number wasn't given
    expect(queryByText(t("application.yourLotteryNumber"))).toBeNull()
  })
})
