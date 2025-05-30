import React from "react"
import { Application, Profile } from "./CustomIcons"
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon"
import ChevronLeftIcon from "@heroicons/react/20/solid/ChevronLeftIcon"
import Clock from "@heroicons/react/24/outline/ClockIcon"
import HeartIcon from "@heroicons/react/24/outline/HeartIcon"
import HeartIconSolid from "@heroicons/react/24/solid/HeartIcon"
import HomeModernIcon from "@heroicons/react/24/outline/HomeModernIcon"
import HouseIcon from "@heroicons/react/24/outline/HomeIcon"
import EnvelopeIcon from "@heroicons/react/24/outline/EnvelopeIcon"
import Cog8ToothIcon from "@heroicons/react/24/solid/Cog8ToothIcon"
import MapPinIcon from "@heroicons/react/24/outline/MapPinIcon"

export const CustomIconMap = {
  application: Application,
  profile: Profile,
  lockClosed: <LockClosedIcon />,
  chevronLeft: <ChevronLeftIcon />,
  clock: <Clock />,
  heartIcon: <HeartIcon />,
  heartIconSolid: <HeartIconSolid />,
  home: <HomeModernIcon />,
  envelope: <EnvelopeIcon />,
  gear: <Cog8ToothIcon />,
  mapPin: <MapPinIcon />,
  house: <HouseIcon />,
}

export type CustomIconType = keyof typeof CustomIconMap
