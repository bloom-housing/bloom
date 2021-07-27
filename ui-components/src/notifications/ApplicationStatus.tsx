import * as React from "react"
import { Icon, IconFillColors } from "../icons/Icon"
import { ApplicationStatusType } from "../global/ApplicationStatusType"
import "./ApplicationStatus.scss"

export interface ApplicationStatusProps {
  content: string
  status: ApplicationStatusType
  vivid?: boolean
}

const ApplicationStatus = (props: ApplicationStatusProps) => {
  let bgColor = ""

  // determine styling
  const vivid = props.vivid || false
  const textColor = vivid ? "text-white" : "text-gray-800"
  const textSize = vivid ? "text-xs" : "text-sm"

  const status = props.status || ApplicationStatusType.Open
  const content = props.content || "Application status content"

  switch (status) {
    case ApplicationStatusType.Open:
      bgColor = vivid ? "bg-primary" : "bg-primary-light"
      break
    case ApplicationStatusType.Closed:
      bgColor = vivid ? "bg-alert" : "bg-alert-light"
      break
    default:
      bgColor = "bg-primary"
  }

  return (
    <div className={`application-status ${textSize} ${textColor} ${bgColor}`}>
      <Icon size="medium" symbol="clock" fill={vivid ? IconFillColors.white : undefined} /> &nbsp;
      {content}
    </div>
  )
}

export { ApplicationStatus as default, ApplicationStatus }
