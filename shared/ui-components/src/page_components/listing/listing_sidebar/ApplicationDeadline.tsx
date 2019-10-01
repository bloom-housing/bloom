import * as React from "react"
import * as moment from "moment"

interface ApplicationDeadlineProps {
  date: string
}

const ApplicationDeadline = (props: ApplicationDeadlineProps) => {
  const dueDate = moment(props.date)
  const formattedDate = dueDate.format("MMM DD, YYYY") + " at " + dueDate.format("h:mm A")
  let bgColor, content
  // if due date is in future, listing is open
  if (moment() < dueDate) {
    bgColor = "bg-blue-100"
    content = "Application Deadline"
  } else {
    bgColor = "bg-red-200"
    content = "Applications Closed"
  }

  return (
    <div className={"text-xs text-gray-800 p-4 " + bgColor}>
      {content} {formattedDate}
    </div>
  )
}

export default ApplicationDeadline
