import React from "react"
import { render, cleanup } from "@testing-library/react"
import DownloadLotteryResults from "../../src/page_components/listing/listing_sidebar/events/DownloadLotteryResults"

afterEach(cleanup)

describe("<DownloadLotteryResults>", () => {
  it("renders strings", () => {
    const { getByText } = render(
      <DownloadLotteryResults
        resultsDate={"February 21, 2023"}
        pdfURL={"https://www.exygy.com"}
        buttonText={"View lottery results"}
      />
    )
    expect(getByText("February 21, 2023")).toBeTruthy()
    expect(getByText("Lottery Results")).toBeTruthy()
    expect(getByText("View lottery results")).toBeTruthy()
  })
})
