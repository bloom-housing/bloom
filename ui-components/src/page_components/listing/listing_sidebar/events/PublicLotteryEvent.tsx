import * as React from "react"
import { ListingEvent } from "@bloom-housing/backend-core/types"
import { EventDateSection } from "../../../../sections/EventDateSection"
import { t } from "../../../../helpers/translator"

const PublicLotteryEvent = (props: { publicLottery: ListingEvent }) => {
  return (
    <section className="aside-block -mx-4 pt-0 md:mx-0 md:pt-4">
      <h4 className="text-caps-underline">{t("listings.publicLottery.header")}</h4>
      <EventDateSection event={props.publicLottery} />
      {props.publicLottery.url && (
        <p className="text text-gray-800 pb-3">
          <a href={props.publicLottery.url}>{t("listings.publicLottery.seeVideo")}</a>
        </p>
      )}
      {props.publicLottery.note && <p className="text text-gray-600">{props.publicLottery.note}</p>}
    </section>
  )
}

export { PublicLotteryEvent as default, PublicLotteryEvent }
