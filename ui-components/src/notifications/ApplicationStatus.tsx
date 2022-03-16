import * as React from "react"
import { Icon, IconFillColors, IconTypes } from "../icons/Icon"
import { ApplicationStatusType } from "../global/ApplicationStatusType"
import "./ApplicationStatus.scss"

export interface ApplicationStatusProps {
  content: string
  iconColor?: string
  iconType?: IconTypes
  status?: ApplicationStatusType
  subContent?: string
  vivid?: boolean
  withIcon?: boolean
}

const ApplicationStatus = (props: ApplicationStatusProps) => {
  let bgColor = ""
  const {
    content,
    iconColor,
    iconType = "clock",
    status = ApplicationStatusType.Open,
    subContent,
    vivid,
    withIcon = true,
  } = props

  // determine styling
  let textColor = vivid ? "text-white" : "text-gray-800"
  const textSize = vivid ? "text-xs" : "text-sm"

  const icon = withIcon && (
    <span>
      <Icon
        size="medium"
        symbol={iconType}
        fill={iconColor || (vivid ? IconFillColors.white : undefined)}
      />{" "}
      &nbsp;
    </span>
  )

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
        {subContent && (
          <>
            <br />
            {subContent}
          </>
        )}
      </span>
    </div>
  )
}

export { ApplicationStatus as default, ApplicationStatus }
