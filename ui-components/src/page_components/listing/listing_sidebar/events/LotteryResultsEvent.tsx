import * as React from "react"
import { ListingEvent } from "@bloom-housing/backend-core/types"
import { t } from "../../../../helpers/translator"
import dayjs from "dayjs"

const LotteryResultsEvent = (props: { event: ListingEvent }) => {
  const { event } = props
  return (
    <section className="aside-block">
      <h4 className="text-caps-underline">{t("listings.lotteryResults.header")}</h4>
      <p className="text text-gray-800 pb-3 flex justify-between items-center">
        <span className="inline-block">{dayjs(props.event.startTime).format("MMMM D, YYYY")}</span>
      </p>
      {event.note && <p className="text text-gray-600">{event.note}</p>}
      {!event.note && (
        <p className="text-tiny text-gray-600">
          {t("listings.lotteryResults.completeResultsWillBePosted", {
            hour: dayjs(props.event.startTime).format("h a"),
          })}
        </p>
      )}
    </section>
  )
}

export { LotteryResultsEvent as default, LotteryResultsEvent }
