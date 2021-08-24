import React from "react"
import { render, cleanup } from "@testing-library/react"
import { AppStatusItem } from "../../src/blocks/AppStatusItem"
import moment from "moment"
import { t } from "../../src/helpers/translator"

afterEach(cleanup)

describe("<AppStatusItem>", () => {
  it("renders without error", () => {
    const { getByText, queryByText } = render(
      <AppStatusItem
        applicationDueDate={new Date()}
        applicationURL={"application/1234abcd"}
        applicationUpdatedAt={new Date()}
        confirmationNumber={"1234abcd"}
        listingName={"Listing Name"}
        listingURL={"/listing/abcd1234/listing-name"}
      />
    )

    expect(getByText("Listing Name")).not.toBeNull()
    expect(getByText(t("listings.applicationDeadline"), { exact: false })).not.toBeNull()
    expect(getByText(t("application.yourLotteryNumber"), { exact: false })).not.toBeNull()
  })
  it("renders without a confirmation number or due date if not provided", () => {
    const { getByText, queryByText } = render(
      <AppStatusItem
        applicationURL={"application/1234abcd"}
        applicationUpdatedAt={new Date()}
        listingName={"Listing Name"}
        listingURL={"/listing/abcd1234/listing-name"}
      />
    )

    expect(getByText("Listing Name")).not.toBeNull()
    expect(queryByText(t("listings.applicationDeadline"), { exact: false })).toBeNull()
    expect(queryByText(t("application.yourLotteryNumber"))).toBeNull()
  })
})
