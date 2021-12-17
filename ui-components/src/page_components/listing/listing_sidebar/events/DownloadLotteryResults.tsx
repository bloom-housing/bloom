import * as React from "react"
import { ListingEvent } from "@bloom-housing/backend-core/types"
import { t } from "../../../../helpers/translator"
import moment from "moment"

const DownloadLotteryResults = (props: { event: ListingEvent; pdfUrl: string }) => {
  const { event, pdfUrl } = props
  const eventUrl = event ? pdfUrl : null
  return (
    <>
      {eventUrl && (
        <section className="aside-block text-center">
          <h2 className="text-caps pb-4">{t("listings.lotteryResults.header")}</h2>
          <p className="uppercase text-gray-800 text-tiny font-semibold pb-4">
            {moment(event.startTime).format("MMMM D, YYYY")}
          </p>
          <a
            className="button is-primary w-full mb-2"
            href={eventUrl}
            title={t("listings.lotteryResults.downloadResults")}
            target="_blank"
          >
            {t("listings.lotteryResults.downloadResults")}
          </a>
        </section>
      )}
    </>
  )
}

export { DownloadLotteryResults as default, DownloadLotteryResults }
