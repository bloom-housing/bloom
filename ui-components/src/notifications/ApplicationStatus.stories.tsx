import * as React from "react"

import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
import { ApplicationStatus } from "./ApplicationStatus"
import { ApplicationStatusType } from "../global/ApplicationStatusType"
import { t } from "../helpers/translator"
import { text, withKnobs } from "@storybook/addon-knobs"

dayjs.extend(advancedFormat)

export default {
  component: ApplicationStatus,
  title: "Notifications/Application Status",
  decorators: [(storyFn: any) => <div>{storyFn()}</div>, withKnobs],
}

export const dueSoonAndVivid = () => (
  <ApplicationStatus
    content={t("listings.applicationDeadline") + ": " + "November 11, 2022"}
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
    content={t("listings.applicationDeadline") + ": " + "November 11, 2022 at 5:00PM"}
    status={ApplicationStatusType.Open}
  />
)

export const pastDue = () => (
  <ApplicationStatus
    content={t("listings.applicationsClosed") + ": " + "November 11, 2022"}
    status={ApplicationStatusType.Closed}
  />
)

export const pastDueAndVivid = () => (
  <ApplicationStatus
    content={t("listings.applicationsClosed") + ": " + "November 11, 2022"}
    status={ApplicationStatusType.Closed}
    vivid={true}
  />
)

export const pastDueWithIconColor = () => (
  <ApplicationStatus
    content={t("listings.applicationsClosed") + ": " + "November 11, 2022"}
    iconColor={text("Icon Color", "#ff0000")}
    status={ApplicationStatusType.Closed}
  />
)

export const openSoon = () => (
  <ApplicationStatus
    content={t("listings.applicationOpenPeriod") + ": " + "November 11, 2022"}
    status={ApplicationStatusType.Open}
  />
)

export const openedAlready = () => (
  <ApplicationStatus
    content={t("listings.applicationDeadline") + ": " + "November 11, 2022"}
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
