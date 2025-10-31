import Formatter from "./Formatter"
import { createDate, createTime } from "../helpers"
import {
  ListingEvent,
  ListingEventCreate,
  ListingEventsTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export default class EventsFormatter extends Formatter {
  /** Process public lottery and open house events */
  process() {
    const events: ListingEventCreate[] = this.data.listingEvents?.filter(
      (event) =>
        !(
          event?.type === ListingEventsTypeEnum.publicLottery ||
          event?.type === ListingEventsTypeEnum.openHouse
        )
    )
    if (
      this.data.listingAvailabilityQuestion &&
      this.data.reviewOrderQuestion === "reviewOrderLottery" &&
      this.data.lotteryDate &&
      this.data.lotteryDate.day &&
      this.data.lotteryDate.month &&
      this.data.lotteryDate.year
    ) {
      events.push({
        type: ListingEventsTypeEnum.publicLottery,
        startTime: createTime(createDate(this.data.lotteryDate), this.data.lotteryStartTime),
        startDate: createTime(createDate(this.data.lotteryDate), {
          hours: "12",
          minutes: "00",
          period: "pm",
        }),
        endTime: createTime(createDate(this.data.lotteryDate), this.data.lotteryEndTime),
        note: this.data.lotteryDateNotes,
      })
    }

    if (this.metadata.openHouseEvents) {
      this.metadata.openHouseEvents.forEach((event) => {
        events.push({
          type: ListingEventsTypeEnum.openHouse,
          ...event,
        })
      })
    }

    this.data.listingEvents = events as ListingEvent[]
  }
}
