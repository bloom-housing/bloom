import React from "react"
import { render, cleanup } from "@testing-library/react"
import { t } from "@bloom-housing/ui-components"
import { StatusItem } from "../../../src/components/account/StatusItem"
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

afterEach(cleanup)

describe("<StatusItem>", () => {
  it("renders open application without error", () => {
    const { getByText, queryByText } = render(
      <StatusItem
        applicationDueDate={"March 10th, 2022"}
        applicationURL={"application/1234abcd"}
        confirmationNumber={"1234abcd"}
        listingName={"Listing Name"}
        listingStatus={ListingsStatusEnum.active}
        listingURL={"/listing/abcd1234/listing-name"}
      />
    )

    expect(getByText("Listing Name")).not.toBeNull()
    expect(getByText(t("account.openApplications"), { exact: false })).not.toBeNull()
    expect(getByText(t("account.applicationsClose"), { exact: false })).not.toBeNull()
    expect(getByText(t("application.yourLotteryNumber"), { exact: false })).not.toBeNull()

    expect(getByText(t("application.viewApplication"), { exact: false })).not.toBeNull()
    expect(getByText(t("t.seeListing"), { exact: false })).not.toBeNull()
    expect(queryByText(t("account.application.lottery.viewResults"), { exact: false })).toBeNull()
  })

  it("renders open application without a confirmation number or due date if not provided", () => {
    const { getByText, queryByText } = render(
      <StatusItem
        applicationURL={"application/1234abcd"}
        confirmationNumber={"1234abcd"}
        listingName={"Listing Name"}
        listingStatus={ListingsStatusEnum.active}
        listingURL={"/listing/abcd1234/listing-name"}
      />
    )

    expect(getByText("Listing Name")).not.toBeNull()
    expect(getByText(t("account.openApplications"), { exact: false })).not.toBeNull()
    expect(queryByText(t("account.applicationsClose"), { exact: false })).toBeNull()
    expect(getByText(t("application.yourLotteryNumber"), { exact: false })).not.toBeNull()

    expect(getByText(t("application.viewApplication"), { exact: false })).not.toBeNull()
    expect(getByText(t("t.seeListing"), { exact: false })).not.toBeNull()
    expect(queryByText(t("account.application.lottery.viewResults"))).toBeFalsy()
  })

  it("renders closed lottery application without error", () => {
    const { getByText, queryByText } = render(
      <StatusItem
        applicationURL={"application/1234abcd"}
        confirmationNumber={"1234abcd"}
        listingName={"Listing Name"}
        listingStatus={ListingsStatusEnum.closed}
        listingURL={"/listing/abcd1234/listing-name"}
        lotteryStartDate={"March 10th, 2022"}
      />
    )

    expect(getByText("Listing Name")).not.toBeNull()
    expect(getByText(t("account.closedApplications"), { exact: false })).not.toBeNull()
    expect(getByText(t("account.lotteryDate"), { exact: false })).not.toBeNull()
    expect(getByText(t("application.yourLotteryNumber"), { exact: false })).not.toBeNull()

    expect(getByText(t("application.viewApplication"), { exact: false })).not.toBeNull()
    expect(getByText(t("t.seeListing"), { exact: false })).not.toBeNull()
    expect(queryByText(t("account.application.lottery.viewResults"), { exact: false })).toBeNull()
  })

  it("renders closed non-lottery application without error", () => {
    const { getByText, queryByText } = render(
      <StatusItem
        applicationURL={"application/1234abcd"}
        confirmationNumber={"1234abcd"}
        listingName={"Listing Name"}
        listingStatus={ListingsStatusEnum.closed}
        listingURL={"/listing/abcd1234/listing-name"}
      />
    )

    expect(getByText("Listing Name")).not.toBeNull()
    expect(getByText(t("account.closedApplications"), { exact: false })).not.toBeNull()
    expect(queryByText(t("account.lotteryDate"), { exact: false })).toBeNull()
    expect(getByText(t("application.yourLotteryNumber"), { exact: false })).not.toBeNull()

    expect(getByText(t("application.viewApplication"), { exact: false })).not.toBeNull()
    expect(getByText(t("t.seeListing"), { exact: false })).not.toBeNull()
    expect(queryByText(t("account.application.lottery.viewResults"), { exact: false })).toBeNull()
  })

  it("renders lottery run application without error", () => {
    const { getByText } = render(
      <StatusItem
        applicationURL={"application/1234abcd"}
        confirmationNumber={"1234abcd"}
        listingName={"Listing Name"}
        listingStatus={ListingsStatusEnum.active}
        listingURL={"/listing/abcd1234/listing-name"}
        lotteryPublishedDate={"March 10th, 2022"}
        lotteryResults={true}
      />
    )

    expect(getByText("Listing Name")).not.toBeNull()
    expect(getByText(t("account.lotteryRun"), { exact: false })).not.toBeNull()
    expect(getByText(t("account.lotteryPosted"), { exact: false })).not.toBeNull()
    expect(getByText(t("application.yourLotteryNumber"), { exact: false })).not.toBeNull()

    expect(getByText(t("account.application.lottery.viewResults"), { exact: false })).not.toBeNull()
    expect(getByText(t("application.viewApplication"), { exact: false })).not.toBeNull()
    expect(getByText(t("t.seeListing"), { exact: false })).not.toBeNull()
  })
})
