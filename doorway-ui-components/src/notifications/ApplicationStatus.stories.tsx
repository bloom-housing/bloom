import * as React from "react"
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
import { ApplicationStatus } from "./ApplicationStatus"
import { ApplicationStatusType } from "../global/ApplicationStatusType"
import { t } from "../helpers/translator"
import Archer from "../../__tests__/fixtures/archer.json"
import { text, withKnobs } from "@storybook/addon-knobs"
import formatDateTime from "../helpers/DateFormat"

dayjs.extend(advancedFormat)

export default {
  component: ApplicationStatus,
  title: "Notifications/Application Status",
  decorators: [(storyFn: any) => <div>{storyFn()}</div>, withKnobs],
}

const listing = Object.assign({}, Archer) as any
listing.applicationOpenDate = ""
let days = 10
listing.applicationDueDate = dayjs().add(days, "days").format()

export const dueSoonAndVivid = () => (
  <ApplicationStatus
    content={t("listings.applicationDeadline") + ": " + formatDateTime(listing.applicationDueDate)}
    status={ApplicationStatusType.Open}
    vivid
  />
)

export const withSubContent = () => (
  <ApplicationStatus
    content="First Come First Served (and a really long string to test wrapping on smaller sizes)"
    subContent="Application Due Date: July 10th"
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

listingPast.applicationDueDate = dayjs().subtract(days, "days").format()

export const pastDueAndVivid = () => (
  <ApplicationStatus
    content={
      t("listings.applicationsClosed") + ": " + formatDateTime(listingPast.applicationDueDate)
    }
    status={ApplicationStatusType.Closed}
    vivid={true}
  />
)

export const pastDueWithStyles = () => (
  <ApplicationStatus
    className={text("className", "place-content-center")}
    content={
      t("listings.applicationsClosed") + ": " + formatDateTime(listingPast.applicationDueDate)
    }
    status={ApplicationStatusType.Closed}
  />
)

export const pastDueWithIconColor = () => (
  <ApplicationStatus
    content={
      t("listings.applicationsClosed") + ": " + formatDateTime(listingPast.applicationDueDate)
    }
    iconColor={text("Icon Color", "#ff0000")}
    status={ApplicationStatusType.Closed}
  />
)

const listing2 = Object.assign({}, Archer) as any
days = 10
listing2.applicationDueDate = dayjs().add(days, "days").format()

export const openSoon = () => (
  <ApplicationStatus
    content={
      t("listings.applicationOpenPeriod") + ": " + formatDateTime(listing2.applicationDueDate)
    }
    status={ApplicationStatusType.Open}
  />
)

const listing3 = Object.assign({}, Archer) as any
days = 10
listing3.applicationDueDate = dayjs().add(days, "days").format()

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

export const postLottery = () => (
  <ApplicationStatus
    content={"Post-lottery content: " + dayjs().format("MMMM Do, YYYY")}
    status={ApplicationStatusType.PostLottery}
    withIcon={false}
  />
)

export const matched = () => (
  <ApplicationStatus
    content={"Matched"}
    status={ApplicationStatusType.Matched}
    withIcon={true}
    iconType={"check"}
  />
)
