import React from "react"
import { render, cleanup } from "@testing-library/react"
import { t } from "@bloom-housing/ui-components"
import { StatusItem } from "../../../src/components/account/StatusItem"
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

afterEach(cleanup)

describe("<StatusItem>", () => {
  beforeAll(() => {
    process.env.showPublicLottery = "TRUE"
  })

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

    expect(getByText("Listing Name")).toBeInTheDocument()
    expect(getByText(t("account.openApplications"))).toBeInTheDocument()
    expect(getByText(t("account.applicationsClose"))).toBeInTheDocument()
    expect(getByText(t("application.yourLotteryNumber"), { exact: false })).toBeInTheDocument()

    expect(getByText(t("application.viewApplication"))).toBeInTheDocument()
    expect(getByText(t("t.seeListing"))).toBeInTheDocument()
    expect(queryByText(t("account.application.lottery.viewResults"))).not.toBeInTheDocument()
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

    expect(getByText("Listing Name")).toBeInTheDocument()
    expect(getByText(t("account.openApplications"))).toBeInTheDocument()
    expect(queryByText(t("account.applicationsClose"))).not.toBeInTheDocument()
    expect(getByText(t("application.yourLotteryNumber"), { exact: false })).toBeInTheDocument()

    expect(getByText(t("application.viewApplication"))).toBeInTheDocument()
    expect(getByText(t("t.seeListing"))).toBeInTheDocument()
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

    expect(getByText("Listing Name")).toBeInTheDocument()
    expect(getByText(t("account.closedApplications"))).toBeInTheDocument()
    expect(getByText(t("account.lotteryDate"))).toBeInTheDocument()
    expect(getByText(t("application.yourLotteryNumber"), { exact: false })).toBeInTheDocument()

    expect(getByText(t("application.viewApplication"))).toBeInTheDocument()
    expect(getByText(t("t.seeListing"))).toBeInTheDocument()
    expect(queryByText(t("account.application.lottery.viewResults"))).not.toBeInTheDocument()
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

    expect(getByText("Listing Name")).toBeInTheDocument()
    expect(getByText(t("account.closedApplications"))).toBeInTheDocument()
    expect(queryByText(t("account.lotteryDate"))).not.toBeInTheDocument()
    expect(getByText(t("application.yourLotteryNumber"), { exact: false })).toBeInTheDocument()

    expect(getByText(t("application.viewApplication"))).toBeInTheDocument()
    expect(getByText(t("t.seeListing"))).toBeInTheDocument()
    expect(queryByText(t("account.application.lottery.viewResults"))).not.toBeInTheDocument()
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

    expect(getByText("Listing Name")).toBeInTheDocument()
    expect(getByText(t("account.lotteryRun"))).toBeInTheDocument()
    expect(getByText(t("account.lotteryPosted"))).toBeInTheDocument()
    expect(getByText(t("application.yourLotteryNumber"), { exact: false })).toBeInTheDocument()

    expect(getByText(t("account.application.lottery.viewResults"))).toBeInTheDocument()
    expect(getByText(t("application.viewApplication"))).toBeInTheDocument()
    expect(getByText(t("t.seeListing"))).toBeInTheDocument()
  })
})
