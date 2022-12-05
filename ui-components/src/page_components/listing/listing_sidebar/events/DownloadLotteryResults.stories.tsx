import * as React from "react"
import DownloadLotteryResults from "./DownloadLotteryResults"

export default {
  title: "Listing Sidebar/Events/Download Lottery Results",
}

export const NoDate = () => {
  return (
    <DownloadLotteryResults pdfURL={"https://www.exygy.com"} buttonText={"View lottery results"} />
  )
}

export const Date = () => {
  return (
    <DownloadLotteryResults
      resultsDate={"February 21, 2023"}
      pdfURL={"https://www.exygy.com"}
      buttonText={"View lottery results"}
    />
  )
}
