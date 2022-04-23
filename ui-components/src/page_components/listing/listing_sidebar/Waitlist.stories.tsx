import * as React from "react"
import { Waitlist } from "./Waitlist"

export default {
  title: "Listing Sidebar/Waitlist",
  component: Waitlist,
}

const strings = {
  currentSize: "Current Waitlist Size",
  openSpots: "Open Waitlist Slots",
  finalSize: "Final Waitlist Size",
  sectionTitle: "Available Units and Waitlist",
  description:
    "Once ranked applicants fill all available units, the remaining ranked applicants will be placed on a waitlist for those same units.",
}

export const OpenAndAllValuesSupplied = () => {
  return (
    <Waitlist
      waitlistMaxSize={100}
      waitlistCurrentSize={40}
      waitlistOpenSpots={60}
      strings={strings}
    />
  )
}

export const OpenWithSomeZeroes = () => {
  return (
    <Waitlist
      waitlistMaxSize={10}
      waitlistCurrentSize={0}
      waitlistOpenSpots={0}
      strings={strings}
    />
  )
}

export const OpenWithOnlyMaxAndOpen = () => {
  return <Waitlist waitlistMaxSize={10} waitlistOpenSpots={10} strings={strings} />
}

export const OpenWithOnlyMax = () => {
  return <Waitlist waitlistMaxSize={10} waitlistCurrentSize={null} strings={strings} />
}

export const CustomDescription = () => {
  const customDescription = () => {
    return (
      <div>
        <div className={"italic pb-2"}>Custom styled content.</div>
        <div className={"underline"}>More custom styled content.</div>
      </div>
    )
  }
  return (
    <Waitlist
      waitlistMaxSize={100}
      waitlistCurrentSize={40}
      waitlistOpenSpots={60}
      strings={{ ...strings, description: customDescription() }}
    />
  )
}
