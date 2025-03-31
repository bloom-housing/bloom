import React from "react"
import { Application, Profile } from "./CustomIcons"
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon"
import ChevronLeftIcon from "@heroicons/react/20/solid/ChevronLeftIcon"
import Clock from "@heroicons/react/24/outline/ClockIcon"
import HomeModernIcon from "@heroicons/react/24/outline/HomeModernIcon"
import EnvelopeIcon from "@heroicons/react/24/outline/EnvelopeIcon"
import MapPinIcon from "@heroicons/react/24/outline/MapPinIcon"

export const CustomIconMap = {
  application: Application,
  profile: Profile,
  lockClosed: <LockClosedIcon />,
  chevronLeft: <ChevronLeftIcon />,
  clock: <Clock />,
  home: <HomeModernIcon />,
  envelope: <EnvelopeIcon />,
  mapPin: <MapPinIcon />,
}

export type CustomIconType = keyof typeof CustomIconMap
