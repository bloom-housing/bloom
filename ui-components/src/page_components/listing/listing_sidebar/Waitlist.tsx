import * as React from "react"
import { t } from "../../../helpers/translator"

const WaitlistItem = (props: { className?: string; value: number; text: string }) => {
  return props.value ? (
    <li className={`uppercase text-gray-800 text-tiny ${props.className}`}>
      <span className="text-right w-12 inline-block pr-2">{props.value}</span>
      <span>{props.text}</span>
    </li>
  ) : null
}

export interface WaitlistProps {
  isWaitlistOpen: boolean
  waitlistMaxSize: number
  waitlistCurrentSize: number
  waitlistOpenSpots: number
  unitsAvailable: number
}

const Waitlist = (props: WaitlistProps) => {
  let header, subheader, waitlistItems
  if (!props.isWaitlistOpen && !props.waitlistCurrentSize) return <></>
  if (props.unitsAvailable && props.unitsAvailable > 0 && props.isWaitlistOpen) {
    header = t("listings.waitlist.unitsAndWaitlist")
    subheader = t("listings.waitlist.submitAnApplication")
    waitlistItems = (
      <>
        <WaitlistItem
          value={props.unitsAvailable}
          text={t("listings.availableUnits")}
          className={"font-semibold"}
        />
        {props.waitlistOpenSpots && (
          <WaitlistItem
            value={props.waitlistOpenSpots}
            text={t("listings.waitlist.openSlots")}
            className={"font-semibold"}
          />
        )}
      </>
    )
  } else {
    if (props.isWaitlistOpen) {
      header = t("listings.waitlist.isOpen")
      subheader = t("listings.waitlist.submitForWaitlist")
    } else {
      header = t("listings.waitlist.closed")
      subheader = null
    }
    waitlistItems = (
      <>
        <WaitlistItem
          value={props.waitlistCurrentSize || 0}
          text={t("listings.waitlist.currentSize")}
        />
        {props.waitlistOpenSpots && (
          <WaitlistItem
            value={props.waitlistOpenSpots}
            text={t("listings.waitlist.openSlots")}
            className={"font-semibold"}
          />
        )}
        <WaitlistItem value={props.waitlistMaxSize || 0} text={t("listings.waitlist.finalSize")} />
      </>
    )
  }

  return (
    <section className="aside-block is-tinted">
      <h4 className="text-caps-tiny">{header}</h4>
      <div>
        {subheader && <p className="text-tiny text-gray-800 pb-3">{subheader}</p>}
        {<ul>{waitlistItems}</ul>}
      </div>
    </section>
  )
}

export { Waitlist as default, Waitlist }
