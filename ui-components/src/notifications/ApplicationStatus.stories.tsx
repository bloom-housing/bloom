import * as React from "react"

import moment from "moment"
import { ApplicationStatus } from "./ApplicationStatus"
import { ApplicationStatusType } from "../global/ApplicationStatusType"
import { t } from "../helpers/translator"
import Archer from "../../__tests__/fixtures/archer.json"

export default {
  component: ApplicationStatus,
  title: "Notifications/Application Status",
  decorators: [(storyFn: any) => <div>{storyFn()}</div>],
}

function formatDateTime(date: Date, showTime?: boolean) {
  return (
    moment(date).format("MMMM D, YYYY") +
    (showTime ? ` ${t("t.at")} ` + moment(date).format("h:mm A") : "")
  )
}

const listing = Object.assign({}, Archer) as any
listing.applicationOpenDate = ""
let days = 10
listing.applicationDueDate = moment().add(days, "days").format()
export const dueSoonAndVivid = () => (
  <ApplicationStatus
    content={t("listings.applicationDeadline") + ": " + formatDateTime(listing.applicationDueDate)}
    status={ApplicationStatusType.Open}
    vivid
  />
)

export const dueSoonWithTime = () => (
  <ApplicationStatus
    content={
      t("listings.applicationDeadline") + ": " + formatDateTime(listing.applicationDueDate, true)
    }
    status={ApplicationStatusType.Open}
  />
)

const listingPast = Object.assign({}, Archer) as any
listingPast.applicationOpenDate = ""
days = 10
export const pastDue = () => (
  <ApplicationStatus
    content={
      t("listings.applicationsClosed") + ": " + formatDateTime(listingPast.applicationDueDate)
    }
    status={ApplicationStatusType.Closed}
  />
)

listingPast.applicationDueDate = moment().subtract(days, "days").format()
export const pastDueAndVivid = () => (
  <ApplicationStatus
    content={
      t("listings.applicationsClosed") + ": " + formatDateTime(listingPast.applicationDueDate)
    }
    status={ApplicationStatusType.Closed}
    vivid={true}
  />
)

const listing2 = Object.assign({}, Archer) as any
days = 10
listing2.applicationDueDate = moment().add(days, "days").format()
export const openSoon = () => (
  <ApplicationStatus
    content={
      t("listings.applicationOpenPeriod") + ": " + formatDateTime(listing2.applicationDueDate)
    }
    status={ApplicationStatusType.Open}
  />
)

export const openSoonVivid = () => (
  <ApplicationStatus
    content={t("listings.comingSoon") + ": " + formatDateTime(listing2.applicationDueDate)}
    status={ApplicationStatusType.Open}
    vivid
  />
)

const listing3 = Object.assign({}, Archer) as any
days = 10
listing3.applicationDueDate = moment().add(days, "days").format()
export const openedAlready = () => (
  <ApplicationStatus
    content={t("listings.applicationDeadline") + ": " + formatDateTime(listing3.applicationDueDate)}
    status={ApplicationStatusType.Open}
  />
)

export const openedWithNoDue = () => (
  <ApplicationStatus content={t("listings.applicationFCFS")} status={ApplicationStatusType.Open} />
)

export const openedWithFCFS = () => (
  <ApplicationStatus content={t("listings.applicationFCFS")} status={ApplicationStatusType.Open} />
)

export const openedWithFCFSVivid = () => (
  <ApplicationStatus
    content={t("listings.applicationFCFS")}
    status={ApplicationStatusType.Open}
    vivid
  />
)
