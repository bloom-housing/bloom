import * as React from "react"
import dayjs from "dayjs"
import { Card, Heading, Link } from "@bloom-housing/ui-seeds"
import { getTimeRangeString } from "@bloom-housing/shared-helpers"
import { ListingEventCreate } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import styles from "../ListingViewSeeds.module.scss"

export type DateSectionFlyer = {
  url?: string
  label?: string
}

type DateSectionProps = {
  events?: ListingEventCreate[]
  marketingFlyers?: DateSectionFlyer[]
  heading: string
}

export const DateSection = ({ events, marketingFlyers, heading }: DateSectionProps) => {
  if (!events?.length && !marketingFlyers?.length) return null
  return (
    <Card className={`${styles["mobile-full-width-card"]} ${styles["mobile-no-bottom-border"]}`}>
      <Card.Section>
        <Heading size={"lg"} priority={2} className={"seeds-p-be-header"}>
          {heading}
        </Heading>
        {events?.map((event, index) => {
          const dateString = dayjs(event.startDate).format("MMMM D, YYYY")
          const timeString = getTimeRangeString(event.startTime, event.endTime)
          return (
            <div key={index}>
              {dateString && (
                <div className={`${styles["thin-heading"]} ${index > 0 && `seeds-m-bs-header`}`}>
                  {dateString}
                </div>
              )}
              {timeString && <div className={"seeds-m-bs-text"}>{timeString}</div>}
              {event.url && (
                <div className={"seeds-m-bs-text"}>
                  <Link href={event.url} hideExternalLinkIcon={true}>
                    {event.label || t("listings.openHouseEvent.seeVideo")}
                  </Link>
                </div>
              )}
              {event.note && <div className={"seeds-m-bs-text"}>{event.note}</div>}
            </div>
          )
        })}
        {marketingFlyers?.map((marketingFlyer, index) => (
          <div
            key={`marketingFlyer-${index}`}
            className={`${events?.length || index > 0 ? "seeds-m-bs-header" : ""}`}
          >
            <Link href={marketingFlyer.url} hideExternalLinkIcon={true}>
              {marketingFlyer.label}
            </Link>
          </div>
        ))}
      </Card.Section>
    </Card>
  )
}
