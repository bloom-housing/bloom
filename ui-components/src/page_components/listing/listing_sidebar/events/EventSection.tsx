import * as React from "react"

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
}

const EventSection = (props: EventSectionProps) => {
  if (!props.events.length) return null
  return (
    <section className="aside-block">
      {props.headerText && (
        <h4 className={props.sectionHeader ? "text-caps-underline" : "text-caps-tiny"}>
          {props.headerText}
        </h4>
      )}
      {props.events.map((event, index) => (
        <div key={`events-${index}`}>
          {event.dateString && (
            <p className="text text-gray-800 pb-3 flex justify-between items-center">
              <span className="inline-block text-tiny uppercase">{event.dateString}</span>
              {event.timeString && (
                <span className="inline-block text-sm font-bold ml-5 font-alt-sans">
                  {event.timeString}
                </span>
              )}
            </p>
          )}
          {event.linkURL && event.linkText && (
            <p className="text text-gray-800 pb-3">
              <a href={event.linkURL}>{event.linkText}</a>
            </p>
          )}
          {event.note && <p className="text-tiny text-gray-700">{event.note}</p>}
        </div>
      ))}
    </section>
  )
}

export { EventSection as default, EventSection }
