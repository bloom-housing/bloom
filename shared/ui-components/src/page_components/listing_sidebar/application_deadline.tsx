import * as React from "react"
import * as moment from "moment"

const ApplicationDeadline = (props: any) => {
  const listing = props.listing
  const due_date = moment(listing.application_due_date)
  const formatted_date = due_date.format('ddd DD, YYYY') + ' at ' + due_date.format('h:mm A')

  return (
    <>
      <div className="text-xs text-gray-800">
        Application Deadline {formatted_date}
      </div>
    </>
  )
}

export default ApplicationDeadline
