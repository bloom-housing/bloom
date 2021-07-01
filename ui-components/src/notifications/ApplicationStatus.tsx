import * as React from "react"
import moment from "moment"
import { t } from "../helpers/translator"
import { Listing } from "@bloom-housing/backend-core/types"
import { openDateState } from "../helpers/state"
import { Icon, IconFillColors } from "../icons/Icon"
import "./ApplicationStatus.scss"

export interface ApplicationStatusProps {
  listing: Listing
  vivid?: boolean
}

const ApplicationStatus = (props: ApplicationStatusProps) => {
  let content = ""
  let formattedDate = ""
  let bgColor = ""
  const listing = props.listing

  // determine styling
  const vivid = props.vivid || false
  const textColor = vivid ? "text-white" : "text-gray-800"
  const textSize = vivid ? "text-xs" : "text-sm"

  if (openDateState(listing)) {
    const date = listing.applicationOpenDate
    const openDate = moment(date)
    formattedDate = openDate.format("MMMM D, YYYY")

    bgColor = vivid ? "bg-primary" : "bg-primary-light"
    content = vivid ? t("listings.comingSoon") : t("listings.applicationOpenPeriod")
  } else {
    if (listing.applicationDueDate) {
      const dueDate = moment(listing.applicationDueDate)
      const dueTime = moment(listing.applicationDueTime)
      formattedDate = dueDate.format("MMM. DD, YYYY")
      if (listing.applicationDueTime) {
        formattedDate = formattedDate + ` ${t("t.at")} ` + dueTime.format("h:mm A")
      }

      // if due date is in future, listing is open
      if (moment() < dueDate) {
        bgColor = vivid ? "bg-primary" : "bg-primary-light"
        content = t("listings.applicationDeadline")
      } else {
        bgColor = vivid ? "bg-alert" : "bg-alert-light"
        content = t("listings.applicationsClosed")
      }
    } else {
      bgColor = vivid ? "bg-primary" : "bg-primary-light"
      content = t("listings.applicationFCFS")
    }
  }

  return (
    <div className={`application-status ${textSize} ${textColor} ${bgColor}`}>
      <Icon size="medium" symbol="clock" fill={vivid ? IconFillColors.white : undefined} /> &nbsp;
      {content}
      {formattedDate != "" ? `: ${formattedDate}` : ""}
    </div>
  )
}

export { ApplicationStatus as default, ApplicationStatus }
