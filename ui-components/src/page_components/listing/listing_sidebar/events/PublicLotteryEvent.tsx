import * as React from "react"
import { ListingEvent } from "@bloom-housing/backend-core/types"
import { t } from "../../../../helpers/translator"
import moment from "moment"

const PublicLotteryEvent = (props: { event: ListingEvent }) => {
  const { event } = props
  return (
    <section className="aside-block -mx-4 pt-0 md:mx-0 md:pt-4">
      <h4 className="text-caps-underline">{t("listings.publicLottery.header")}</h4>
      <p className="text text-gray-800 pb-3 flex justify-between items-center">
        <span className="inline-block text-tiny uppercase">
          {moment(props.event.startTime).format("MMMM D, YYYY")}
        </span>
      </p>
      {event.url && (
        <p className="text text-gray-800 pb-3">
          <a href={event.url}>{t("listings.publicLottery.seeVideo")}</a>
        </p>
      )}
      {event.note && <p className="text-tiny text-gray-600">{event.note}</p>}
    </section>
  )
}

export { PublicLotteryEvent as default, PublicLotteryEvent }
