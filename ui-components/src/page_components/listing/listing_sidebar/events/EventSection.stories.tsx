import * as React from "react"
import EventSection, { EventType } from "./EventSection"

export default {
  title: "Listing Sidebar/Events/Event Section",
}

export const NoFields = () => {
  const events: EventType[] = []
  return <EventSection events={events} headerText={"Open Houses"} />
}

export const TimeRange = () => {
  const events: EventType[] = [{ dateString: "July 22, 2022", timeString: "3:00pm - 10:00pm" }]
  return <EventSection events={events} headerText={"Open Houses"} />
}

export const SingleTime = () => {
  const events: EventType[] = [{ dateString: "December 30, 2022", timeString: "10:00am" }]
  return <EventSection events={events} headerText={"Open Houses"} />
}

export const NoTime = () => {
  const events: EventType[] = [{ dateString: "July 22, 2022" }]
  return <EventSection events={events} headerText={"Lottery Results"} />
}

export const URL = () => {
  const events: EventType[] = [
    {
      dateString: "November 22, 2022",
      timeString: "10:00am - 11:00am",
      linkURL: "https://www.exygy.com",
      linkText: "See Video",
    },
  ]
  return <EventSection events={events} headerText={"Open Houses"} />
}

export const Note = () => {
  const events: EventType[] = [
    {
      dateString: "November 22, 2022",
      timeString: "10:00am - 11:00am",
      note:
        "Virtual lottery (not in person). We will post a link to the virtual lottery on February 23rd. Check back then.",
    },
  ]
  return <EventSection events={events} headerText={"Lottery"} sectionHeader={true} />
}

export const NoteAndURL = () => {
  const events: EventType[] = [
    {
      dateString: "November 22, 2022",
      timeString: "10:00am - 11:00am",
      note:
        "Virtual lottery (not in person). We will post a link to the virtual lottery on February 23rd. Check back then.",
      linkURL: "https://www.exygy.com",
      linkText: "See Video",
    },
  ]
  return <EventSection events={events} headerText={"Lottery"} sectionHeader={true} />
}

export const LongStrings = () => {
  const events: EventType[] = [
    {
      dateString: "This is a long date string",
      timeString: "This is a long time string",
    },
  ]
  return <EventSection events={events} headerText={"Open Houses"} />
}

export const MultipleEvents = () => {
  const events: EventType[] = [
    {
      dateString: "November 22, 2022",
      timeString: "10:00am - 11:00am",
      linkURL: "https://www.exygy.com",
      linkText: "See Video",
    },
    {
      dateString: "November 25, 2022",
      timeString: "5:00pm",
      linkURL: "https://www.exygy.com",
      linkText: "Agenda",
    },
  ]
  return <EventSection events={events} headerText={"Open Houses"} />
}

export const PageSectionHeader = () => {
  const events: EventType[] = [
    {
      dateString: "November 22, 2022",
      timeString: "10:00am - 11:00am",
      linkURL: "https://www.exygy.com",
      linkText: "See Video",
    },
    {
      dateString: "November 25, 2022",
      timeString: "5:00pm",
      linkURL: "https://www.exygy.com",
      linkText: "Agenda",
    },
  ]
  return <EventSection events={events} headerText={"Open Houses"} sectionHeader={true} />
}

export const MultipleSections = () => {
  const events: EventType[] = [
    {
      dateString: "November 22, 2022",
      timeString: "10:00am - 11:00am",
      note: "Event note",
    },
  ]
  return (
    <>
      <EventSection events={events} headerText={"Open Houses"} />
      <EventSection events={events} headerText={"Informational Sessions"} />
    </>
  )
}

export const FragmentNote = () => {
  const note = () => {
    return (
      <p>
        I'm a <a href={"https://www.exygy.com"}>fragment note</a>.
      </p>
    )
  }
  const events: EventType[] = [
    {
      dateString: "November 22, 2022",
      timeString: "10:00am - 11:00am",
      note: note(),
    },
  ]
  return (
    <>
      <EventSection events={events} headerText={"Open Houses"} />
    </>
  )
}

export const TitleCapitalizedDate = () => {
  const events: EventType[] = [{ dateString: "July 22, 2022" }]
  return <EventSection events={events} headerText={"Lottery Results"} dateClassName="normal-case" />
}
