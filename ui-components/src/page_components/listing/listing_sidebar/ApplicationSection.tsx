import * as React from "react"
import moment from "moment"
import { Listing } from "@bloom-housing/backend-core/types"
import { Apply } from "./Apply"
import { Waitlist } from "./Waitlist"

export interface ApplicationSectionProps {
  listing: Listing
  internalFormRoute: string
  preview?: boolean
}

const showWaitlist = (listing: Listing) => {
  // Hide waitlist for FCFS and when there are no waitlist spots
  return (
    listing.applicationDueDate != null &&
    listing.isWaitlistOpen &&
    listing.waitlistOpenSpots &&
    listing.waitlistOpenSpots > 0
  )
}

const ApplicationSection = (props: ApplicationSectionProps) => {
  const { listing, preview } = props
  const dueDate = moment(listing.applicationDueDate)
  const nowTime = moment()

  // If applications are closed, hide this section
  if (nowTime > dueDate) return null

  return (
    <>
      {showWaitlist(listing) && (
        <section className="aside-block is-tinted">
          <Waitlist listing={listing} />
        </section>
      )}
      <Apply listing={listing} preview={preview} internalFormRoute={props.internalFormRoute} />
    </>
  )
}

export { ApplicationSection as default, ApplicationSection }
