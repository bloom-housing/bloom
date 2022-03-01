import * as React from "react"
import { Icon, IconFillColors, IconTypes } from "../icons/Icon"
import { ApplicationStatusType } from "../global/ApplicationStatusType"
import "./ApplicationStatus.scss"

export interface ApplicationStatusProps {
  content: string
  subContent?: string
  status?: ApplicationStatusType
  vivid?: boolean
  withIcon?: boolean
  iconType?: IconTypes
}

const ApplicationStatus = (props: ApplicationStatusProps) => {
  let bgColor = ""
  // determine styling
  const vivid = props.vivid || false
  let textColor = vivid ? "text-white" : "text-gray-800"
  const textSize = vivid ? "text-xs" : "text-sm"

  const status = props.status || ApplicationStatusType.Open
  const content = props.content
  const withIcon = props.withIcon ?? true
  const iconType = props.iconType ?? "clock"

  let icon

  if (withIcon) {
    icon = <Icon size="medium" symbol={iconType} fill={vivid ? IconFillColors.white : undefined} />
  }

  switch (status) {
    case ApplicationStatusType.Open:
      bgColor = vivid ? "bg-primary" : "bg-primary-light"
      break
    case ApplicationStatusType.Closed:
      bgColor = vivid ? "bg-alert" : "bg-alert-light"
      break
    case ApplicationStatusType.PostLottery:
      bgColor = "bg-gray-850"
      textColor = "text-white"
      break
    case ApplicationStatusType.Matched:
      bgColor = "bg-green-700"
      textColor = "text-white"
      break
    default:
      bgColor = "bg-primary"
  }

  return (
    <div className={`application-status ${textSize} ${textColor} ${bgColor}`}>
      {icon}
      <span>
        {content}
        {props.subContent && (
          <>
            <br />
            {props.subContent}
          </>
        )}
      </span>
    </div>
  )
}

export { ApplicationStatus as default, ApplicationStatus }
