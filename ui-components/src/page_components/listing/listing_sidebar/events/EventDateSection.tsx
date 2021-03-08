import * as React from "react"
import { ListingEvent } from "@bloom-housing/backend-core/types"
import moment from "moment"

const EventDateSection = (props: { event: ListingEvent }) => {
  return (
    <>
      {props.event.startTime && (
        <p className="text text-gray-800 pb-3 flex justify-between items-center">
          <span className="inline-block text-tiny uppercase">
            {moment(props.event.startTime).format("MMMM D, YYYY")}
          </span>
          <span className="inline-block text-sm font-bold">
            {moment(props.event.startTime).format("hh:mma") +
              "-" +
              moment(props.event.endTime).format("hh:mma")}
          </span>
        </p>
      )}
    </>
  )
}

export { EventDateSection as default, EventDateSection }
