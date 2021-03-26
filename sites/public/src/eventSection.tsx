import { Listing, ListingEvent, ListingEventType } from "@bloom-housing/backend-core/types"
import {
  ApplicationSection,
  DownloadLotteryResults,
  LotteryResultsEvent,
  OpenHouseEvent,
  PublicLotteryEvent,
} from "@bloom-housing/ui-components"
import moment from "moment"
import React from "react"

export interface SideSectionsProps {
  listing: Listing
}

const EventSection = (props: SideSectionsProps) => {
  const listing = props.listing

  let openHouseEvents: ListingEvent[] | null = null
  let publicLottery: ListingEvent | null = null
  let lotteryResults: ListingEvent | null = null
  if (Array.isArray(listing.events)) {
    listing.events.forEach((event) => {
      switch (event.type) {
        case ListingEventType.openHouse:
          if (!openHouseEvents) {
            openHouseEvents = []
          }
          openHouseEvents.push(event)
          break
        case ListingEventType.publicLottery:
          publicLottery = event
          break
        case ListingEventType.lotteryResults:
          lotteryResults = event
          break
      }
    })
  }

  let lotterySection
  if (publicLottery && (!lotteryResults || (lotteryResults && !lotteryResults.url))) {
    lotterySection = <PublicLotteryEvent event={publicLottery} />
    if (moment(publicLottery.startTime) < moment() && lotteryResults && !lotteryResults.url) {
      lotterySection = <LotteryResultsEvent event={lotteryResults} />
    }
  }

  return (
    <div>
      <DownloadLotteryResults event={lotteryResults} />
      {openHouseEvents && <OpenHouseEvent events={openHouseEvents} />}
      <ApplicationSection
        listing={listing}
        internalFormRoute="/applications/start/choose-language"
      />
      {lotterySection}
    </div>
  )
}

export default EventSection
