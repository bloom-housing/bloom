import * as React from "react"
import * as moment from "moment"
import { Listing } from "@bloom-housing/core/src/listings"
import Apply from "@bloom-housing/ui-components/src/page_components/listing/listing_sidebar/Apply"
import Waitlist from "@bloom-housing/ui-components/src/page_components/listing/listing_sidebar/Waitlist"

interface ApplicationSectionProps {
  listing: Listing
}

const ApplicationSection = (props: ApplicationSectionProps) => {
  const dueDate = moment(props.listing.applicationDueDate)
  // If applications are closed, hide this section
  if (moment() > dueDate) return null

  return (
    <div>
      <section className="border-gray-400 border-b p-5 bg-gray-100">
        <Waitlist listing={props.listing} />
      </section>
      <Apply listing={props.listing} />
    </div>
  )
}

export default ApplicationSection
