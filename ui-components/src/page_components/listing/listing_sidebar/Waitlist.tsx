import * as React from "react"
import { t } from "../../../helpers/translator"
import { Listing } from "@bloom-housing/backend-core/types"

const WaitlistItem = (props: { className?: string; value: number; text: string }) => (
  <li className={`uppercase text-gray-800 text-tiny ${props.className}`}>
    <span className="text-right w-12 inline-block pr-2">{props.value}</span>
    <span>{props.text}</span>
  </li>
)

export interface WaitlistProps {
  listing: Listing
}

const Waitlist = (props: WaitlistProps) => {
  const listing = props.listing
  const showWaitlistValues =
    listing.waitlistMaxSize !== undefined &&
    listing.waitlistMaxSize !== null &&
    listing.waitlistCurrentSize !== undefined &&
    listing.waitlistCurrentSize !== null &&
    listing.waitlistOpenSpots !== undefined &&
    listing.waitlistOpenSpots !== null
  let header, subheader, waitlistItems

  if (listing?.unitsAvailable && listing.unitsAvailable > 0 && listing.isWaitlistOpen) {
    header = t("listings.waitlist.unitsAndWaitlist")
    subheader = t("listings.waitlist.submitAnApplication")
    waitlistItems = (
      <>
        {showWaitlistValues && (
          <>
            <WaitlistItem
              value={listing.unitsAvailable}
              text={t("listings.availableUnits")}
              className={"font-semibold"}
            />
            {listing.waitlistOpenSpots && (
              <WaitlistItem
                value={listing.waitlistOpenSpots}
                text={t("listings.waitlist.openSlots")}
                className={"font-semibold"}
              />
            )}
          </>
        )}
      </>
    )
  } else {
    if (listing.isWaitlistOpen) {
      header = t("listings.waitlist.isOpen")
      subheader = t("listings.waitlist.submitForWaitlist")
    } else {
      header = t("listings.waitlist.closed")
      subheader = null
    }
    waitlistItems = (
      <>
        {showWaitlistValues && (
          <>
            <WaitlistItem
              value={listing.waitlistCurrentSize || 0}
              text={t("listings.waitlist.currentSize")}
            />
            {listing.waitlistOpenSpots && (
              <WaitlistItem
                value={listing.waitlistOpenSpots}
                text={t("listings.waitlist.openSlots")}
                className={"font-semibold"}
              />
            )}
            <WaitlistItem
              value={listing.waitlistMaxSize || 0}
              text={t("listings.waitlist.finalSize")}
            />
          </>
        )}
      </>
    )
  }

  return (
    <>
      <h4 className="text-caps-tiny">{header}</h4>
      <div>
        {subheader && <p className="text-tiny text-gray-800 pb-3">{subheader}</p>}
        {showWaitlistValues && <ul>{waitlistItems}</ul>}
      </div>
    </>
  )
}

export { Waitlist as default, Waitlist }
