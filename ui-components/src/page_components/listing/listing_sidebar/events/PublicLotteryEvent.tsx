import * as React from "react"
import { ListingEvent } from "@bloom-housing/backend-core/types"
import { t } from "../../../../helpers/translator"
import { EventDateSection } from "./EventDateSection"

const PublicLotteryEvent = (props: { event: ListingEvent }) => {
  const { event } = props
  return (
    <section className="aside-block">
      <h4 className="text-caps-underline">{t("listings.publicLottery.header")}</h4>
      <EventDateSection event={props.event} />
      {event.url && (
        <p className="text text-gray-750 pb-3">
          <a href={event.url}>{t("listings.publicLottery.seeVideo")}</a>
        </p>
      )}
      {event.note && <p className="text-tiny text-gray-600">{event.note}</p>}
    </section>
  )
}

export { PublicLotteryEvent as default, PublicLotteryEvent }
