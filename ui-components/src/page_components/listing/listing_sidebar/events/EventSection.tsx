import * as React from "react"
import { Heading } from "../../../../text/Heading"

export type EventType = {
  timeString?: string
  dateString?: string
  linkURL?: string
  linkText?: string
  note?: string | React.ReactNode
}

type EventSectionProps = {
  events: EventType[]
  headerText?: string
  sectionHeader?: boolean
  dateClassName?: string
}

const EventSection = (props: EventSectionProps) => {
  if (!props.events.length) return null

  const dateClasses = ["inline-block text-tiny uppercase"]

  if (props.dateClassName) {
    dateClasses.push(props.dateClassName)
  }

  return (
    <section className="aside-block">
      {props.headerText && (
        <Heading priority={4} style={props.sectionHeader ? "underlineWeighted" : "capsWeighted"}>
          {props.headerText}
        </Heading>
      )}
      {props.events.map((event, index) => (
        <div key={`events-${index}`} className={`${index !== props.events.length - 1 && "pb-3"}`}>
          {event.dateString && (
            <p className="text text-gray-800 pb-2 flex justify-between items-center">
              <span className={dateClasses.join(" ")}>{event.dateString}</span>
              {event.timeString && (
                <span className="inline-block text-sm font-bold ml-5 font-alt-sans">
                  {event.timeString}
                </span>
              )}
            </p>
          )}
          {event.linkURL && event.linkText && (
            <p className="pb-2 text-tiny">
              <a href={event.linkURL}>{event.linkText}</a>
            </p>
          )}
          {event.note && (
            <p className={`text-tiny text-gray-700 ${index !== props.events.length - 1 && "pb-3"}`}>
              {event.note}
            </p>
          )}
        </div>
      ))}
    </section>
  )
}

export { EventSection as default, EventSection }
