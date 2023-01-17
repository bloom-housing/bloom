import Formatter from "./Formatter"
import { createDate, createTime } from "../helpers"
import {
  ListingEvent,
  ListingEventCreate,
  ListingEventType,
} from "@bloom-housing/backend-core/types"

export default class EventsFormatter extends Formatter {
  /** Process public lottery and open house events */
  process() {
    const events: ListingEventCreate[] = this.data.events?.filter(
      (event) =>
        !(
          event?.type === ListingEventType.publicLottery ||
          event?.type === ListingEventType.openHouse
        )
    )
    if (
      this.data.lotteryDate &&
      this.data.lotteryDate.day &&
      this.data.lotteryDate.month &&
      this.data.lotteryDate.year &&
      this.data.reviewOrderQuestion === "reviewOrderLottery"
    ) {
      events.push({
        type: ListingEventType.publicLottery,
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
          type: ListingEventType.openHouse,
          ...event,
        })
      })
    }

    this.data.events = events as ListingEvent[]
  }
}
