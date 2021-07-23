import * as React from "react"
import moment from "moment"
import { t } from "../helpers/translator"
import { Icon, IconFillColors } from "../icons/Icon"
import { ApplicationStatusType } from "../global/ApplicationStatusType"
import "./ApplicationStatus.scss"

export interface ApplicationStatusProps {
  content: string
  status: ApplicationStatusType
  date?: Date
  showTime?: boolean
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
  const date = props.date || undefined
  const formattedDate = date ? moment(date).format("MMMM D, YYYY") : undefined
  const formattedTime =
    date && props.showTime ? ` ${t("t.at")} ` + moment(date).format("h:mm A") : ""

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
      {formattedDate ? `: ${formattedDate}` + `${formattedTime}` : ""}
    </div>
  )
}

export { ApplicationStatus as default, ApplicationStatus }
