import * as React from "react"
import { Waitlist } from "./Waitlist"

export default {
  title: "Listing Sidebar/Waitlist",
}

export const NotOpen = () => {
  return (
    <Waitlist
      isWaitlistOpen={false}
      waitlistMaxSize={500}
      waitlistCurrentSize={300}
      waitlistOpenSpots={200}
      unitsAvailable={5}
    />
  )
}

export const OpenAndNoUnitsAvailable = () => {
  return (
    <Waitlist
      isWaitlistOpen={true}
      waitlistMaxSize={100}
      waitlistCurrentSize={40}
      waitlistOpenSpots={60}
      unitsAvailable={0}
    />
  )
}

export const OpenAndUnitsAvailable = () => {
  return (
    <Waitlist
      isWaitlistOpen={true}
      waitlistMaxSize={10}
      waitlistCurrentSize={0}
      waitlistOpenSpots={10}
      unitsAvailable={5}
    />
  )
}
