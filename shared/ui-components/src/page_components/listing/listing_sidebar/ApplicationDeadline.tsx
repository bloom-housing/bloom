import * as React from "react"
import * as moment from "moment"
import { Listing } from "../../../types"

interface ApplicationDeadlineProps {
  listing: Listing
}

const ApplicationDeadline = (props: ApplicationDeadlineProps) => {
  const dueDate = moment(props.listing.application_due_date)
  const formattedDate = dueDate.format("ddd DD, YYYY") + " at " + dueDate.format("h:mm A")

  return <div className="text-xs text-gray-800">Application Deadline {formattedDate}</div>
}

export default ApplicationDeadline
