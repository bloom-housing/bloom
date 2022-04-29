import * as React from "react"
import { ListingEvent } from "@bloom-housing/backend-core/types"
import dayjs from "dayjs"

const EventDateSection = (props: { event: ListingEvent }) => {
  const getRangeString = () => {
    const startTime = dayjs(props.event.startTime).format("hh:mma")
    const endTime = dayjs(props.event.endTime).format("hh:mma")
    return startTime === endTime ? startTime : `${startTime} - ${endTime}`
  }
  return (
    <>
      {props.event.startTime && (
        <p className="text text-gray-750 pb-3 flex justify-between items-center">
          <span className="inline-block text-tiny uppercase">
            {dayjs(props.event.startTime).format("MMMM D, YYYY")}
          </span>
          <span className="inline-block text-sm font-bold">{getRangeString()}</span>
        </p>
      )}
    </>
  )
}

export { EventDateSection as default, EventDateSection }
