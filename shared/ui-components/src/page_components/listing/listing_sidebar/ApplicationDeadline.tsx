import * as React from "react"
import * as moment from "moment"

interface ApplicationDeadlineProps {
  date: any
  vivid?: boolean
}

const ApplicationDeadline = (props: ApplicationDeadlineProps) => {
  const dueDate = moment(props.date)
  const formattedDate = dueDate.format("MMM DD, YYYY") + " at " + dueDate.format("h:mm A")
  const vivid = props.vivid || false
  const textColor = vivid ? "text-white" : "text-gray-800"
  let bgColor, content
  // if due date is in future, listing is open
  if (moment() < dueDate) {
    bgColor = vivid ? "bg-blue-600" : "bg-blue-100"
    content = "Application Deadline"
  } else {
    bgColor = vivid ? "bg-red-600" : "bg-red-200"
    content = "Applications Closed"
  }

  return (
    <div className={`text-xs p-4 ${textColor} ${bgColor}`}>
      {content}: {formattedDate}
    </div>
  )
}

export default ApplicationDeadline
