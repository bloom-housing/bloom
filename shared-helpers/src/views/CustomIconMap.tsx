import React from "react"
import { Application, Profile } from "./CustomIcons"
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon"
import ChevronLeftIcon from "@heroicons/react/24/solid/ChevronLeftIcon"

export const CustomIconMap = {
  application: Application,
  profile: Profile,
  lockClosed: <LockClosedIcon />,
  chevronLeft: <ChevronLeftIcon />
}

export type CustomIconType = keyof typeof CustomIconMap
