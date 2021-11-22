import * as React from "react"
import { Waitlist } from "./Waitlist"

export default {
  title: "Listing Sidebar/Waitlist",
}

export const NotOpen = () => {
  return (
    <>
      <Waitlist isWaitlistOpen={false} />
      <p>
        <br />
        <br />
        <br />
        (Note: this should be blank ^^^)
      </p>
    </>
  )
}

export const OpenAndAllValuesSupplied = () => {
  return (
    <Waitlist
      isWaitlistOpen={true}
      waitlistMaxSize={100}
      waitlistCurrentSize={40}
      waitlistOpenSpots={60}
    />
  )
}

export const OpenWithSomeZeroes = () => {
  return (
    <Waitlist
      isWaitlistOpen={true}
      waitlistMaxSize={10}
      waitlistCurrentSize={0}
      waitlistOpenSpots={0}
    />
  )
}

export const OpenWithOnlyMaxAndOpen = () => {
  return <Waitlist isWaitlistOpen={true} waitlistMaxSize={10} waitlistOpenSpots={10} />
}

export const OpenWithOnlyMax = () => {
  return <Waitlist isWaitlistOpen={true} waitlistMaxSize={10} />
}
