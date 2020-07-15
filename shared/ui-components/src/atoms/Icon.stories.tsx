import React from "react"
import { withA11Y } from "@storybook/addon-a11y"
import SVG from "react-inlinesvg"
import { Icon } from "./Icon"

export default {
  title: "Atoms|Icon",
  decorators: [
    withA11Y,
    (storyFn: any) => (
      <div style={{ padding: "1rem" }}>
        {storyFn()}
        <SVG src="/images/icons.svg" />
      </div>
    ),
  ],
}

export const IconOval = () => <Icon size="large" symbol="oval" />
export const IconCross = () => <Icon size="large" symbol="cross" />
export const IconPolygon = () => <Icon size="large" symbol="polygon" />
export const IconApplication = () => <Icon size="large" symbol="application" />
export const IconArrowDown = () => <Icon size="large" symbol="arrow-down" />
export const IconAssistance = () => <Icon size="large" symbol="assistance" />
export const IconAsterisk = () => <Icon size="large" symbol="asterisk" />
export const IconBed = () => <Icon size="large" symbol="bed" />
export const IconBrowse = () => <Icon size="large" symbol="browse" />
export const IconCalendar = () => <Icon size="large" symbol="calendar" />
export const IconCloseRound = () => <Icon size="large" symbol="close-round" />
export const IconEdit = () => <Icon size="large" symbol="edit" />
export const IconEligibility = () => <Icon size="large" symbol="eligibility" />
export const IconEye = () => <Icon size="large" symbol="eye" />
export const IconFavorite = () => <Icon size="large" symbol="favorite" />
export const IconDownload = () => <Icon size="large" symbol="download" />
export const IconFile = () => <Icon size="large" symbol="file" />
export const IconGlobe = () => <Icon size="large" symbol="globe" />
export const IconQuestion = () => <Icon size="large" symbol="question" />
export const IconLikeFill = () => <Icon size="large" symbol="like-fill" />
export const IconLike = () => <Icon size="large" symbol="like" />
export const IconLightBulb = () => <Icon size="large" symbol="light-bulb" />
export const IconLink = () => <Icon size="large" symbol="link" />
export const IconList = () => <Icon size="large" symbol="list" />
export const IconLock = () => <Icon size="large" symbol="lock" />
export const IconMail = () => <Icon size="large" symbol="mail" />
export const IconMap = () => <Icon size="large" symbol="map" />
export const IconMenu = () => <Icon size="large" symbol="menu" />
export const IconPhone = () => <Icon size="large" symbol="phone" />
export const IconPlus = () => <Icon size="large" symbol="plus" />
export const IconProfile = () => <Icon size="large" symbol="profile" />
export const IconSettings = () => <Icon size="large" symbol="settings" />
export const IconCheck = () => <Icon size="large" symbol="check" />
export const IconClock = () => <Icon size="large" symbol="clock" />
export const IconClose = () => <Icon size="large" symbol="close" />
export const IconDown = () => <Icon size="large" symbol="down" />
export const IconBuilding = () => <Icon size="large" symbol="building" />
export const IconLeft = () => <Icon size="large" symbol="left" />
export const IconMapThin = () => <Icon size="large" symbol="map-thin" />
export const IconRight = () => <Icon size="large" symbol="right" />
export const IconForward = () => <Icon size="large" symbol="forward" />
export const IconResult = () => <Icon size="large" symbol="result" />
export const IconTicket = () => <Icon size="large" symbol="ticket" />
export const IconTrash = () => <Icon size="large" symbol="trash" />
export const IconWarning = () => <Icon size="large" symbol="warning" />
export const IconStar = () => <Icon size="large" symbol="star" />
export const IconSearch = () => <Icon size="large" symbol="search" />
export const IconInfo = () => <Icon size="large" symbol="info" />
