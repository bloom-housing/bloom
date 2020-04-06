import * as React from "react"
import t from "../../../helpers/translator"
import { Listing } from "@bloom-housing/core"

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
  const showWaitlistValues = listing.waitlistCurrentSize != null && listing.waitlistMaxSize != null
  const waitlistOpen = listing.waitlistCurrentSize < listing.waitlistMaxSize
  const header = waitlistOpen ? "Waitlist open" : "Waitlist closed"
  let availableUnitsInfo

  if (listing.unitsAvailable == 0) {
    availableUnitsInfo = (
      <p className="text-sm italic text-gray-700 pb-3">{t("listings.noAvailableUnits")}</p>
    )
  }

  return (
    <>
      <h4 className="text-caps-tiny">{header}</h4>
      <div>
        {availableUnitsInfo}
        <p className="text-tiny text-gray-800 pb-3">
          {t("listings.waitlist.submitAnApplication", { units: listing.buildingTotalUnits })}
        </p>
        {showWaitlistValues && (
          <ul>
            <WaitlistItem
              value={listing.waitlistCurrentSize}
              text={t("listings.waitlist.currentSize")}
            />
            <WaitlistItem
              value={listing.waitlistMaxSize - listing.waitlistCurrentSize}
              text={t("listings.waitlist.openSlots")}
              className={"font-semibold"}
            />
            <WaitlistItem value={listing.waitlistMaxSize} text={t("listings.waitlist.finalSize")} />
          </ul>
        )}
      </div>
    </>
  )
}

export { Waitlist as default, Waitlist }
