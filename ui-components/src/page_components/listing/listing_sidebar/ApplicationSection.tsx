import * as React from "react"
import moment from "moment"
import { Listing } from "@bloom-housing/backend-core/types"
import { Apply } from "./Apply"
import { Waitlist } from "./Waitlist"

export interface ApplicationSectionProps {
  listing: Listing
  internalFormRoute: string
}

const showWaitlist = (listing: Listing) => {
  const hasWaitlist =
    !isNaN(listing.waitlistMaxSize) && listing.waitlistMaxSize - listing.waitlistCurrentSize > 0

  // Hide waitlist for FCFS and when ther are no waitlist spots
  return listing.applicationDueDate != null && hasWaitlist
}

const ApplicationSection = (props: ApplicationSectionProps) => {
  const listing = props.listing
  const dueDate = moment(listing.applicationDueDate)
  const nowTime = moment()

  // If applications are closed, hide this section
  if (nowTime > dueDate) return null

  return (
    <div>
      {showWaitlist(listing) && (
        <section className="aside-block bg-primary-lighter border-t">
          <Waitlist listing={listing} />
        </section>
      )}
      <Apply listing={listing} internalFormRoute={props.internalFormRoute} />
    </div>
  )
}

export { ApplicationSection as default, ApplicationSection }
