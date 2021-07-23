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

const listing = Object.assign({}, Archer) as any
listing.applicationOpenDate = ""
let days = 10
listing.applicationDueDate = moment().add(days, "days").format()
export const dueSoonAndVivid = () => (
  <ApplicationStatus
    content={t("listings.applicationDeadline")}
    date={listing.applicationDueDate}
    status={ApplicationStatusType.Open}
    vivid
  />
)

export const dueSoonWithTime = () => (
  <ApplicationStatus
    content={t("listings.applicationDeadline")}
    date={listing.applicationDueDate}
    status={ApplicationStatusType.Open}
    showTime
  />
)

const listingPast = Object.assign({}, Archer) as any
listingPast.applicationOpenDate = ""
days = 10
export const pastDue = () => (
  <ApplicationStatus
    content={t("listings.applicationsClosed")}
    date={listingPast.applicationDueDate}
    status={ApplicationStatusType.Closed}
  />
)

listingPast.applicationDueDate = moment().subtract(days, "days").format()
export const pastDueAndVivid = () => (
  <ApplicationStatus
    content={t("listings.applicationsClosed")}
    date={listingPast.applicationDueDate}
    status={ApplicationStatusType.Closed}
    vivid={true}
  />
)

const listing2 = Object.assign({}, Archer) as any
days = 5
listing2.applicationOpenDate = moment().add(days, "days").format()
days = 10
listing2.applicationDueDate = moment().add(days, "days").format()
export const openSoon = () => (
  <ApplicationStatus
    content={t("listings.applicationOpenPeriod")}
    date={listing2.applicationDueDate}
    status={ApplicationStatusType.Open}
  />
)

export const openSoonVivid = () => (
  <ApplicationStatus
    content={t("listings.comingSoon")}
    date={listing2.applicationDueDate}
    status={ApplicationStatusType.Open}
    vivid
  />
)

const listing3 = Object.assign({}, Archer) as any
days = 5
listing3.applicationOpenDate = moment().subtract(days, "days").format()
days = 10
listing3.applicationDueDate = moment().add(days, "days").format()
export const openedAlready = () => (
  <ApplicationStatus
    content={t("listings.applicationDeadline")}
    date={listing3.applicationDueDate}
    status={ApplicationStatusType.Open}
  />
)

const listing4 = Object.assign({}, Archer) as any
days = 15
listing4.applicationOpenDate = moment().subtract(days, "days").format()
listing4.applicationDueDate = ""
export const openedWithNoDue = () => (
  <ApplicationStatus content={t("listings.applicationFCFS")} status={ApplicationStatusType.Open} />
)

const listing5 = Object.assign({}, Archer) as any
days = 15
listing5.applicationOpenDate = moment().subtract(days, "days").format()
listing5.applicationDueDate = null
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
