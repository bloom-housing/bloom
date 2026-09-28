import React from "react"
import ChartBarIcon from "@heroicons/react/24/outline/ChartBarIcon"
import ChevronLeftIcon from "@heroicons/react/20/solid/ChevronLeftIcon"
import Clock from "@heroicons/react/24/outline/ClockIcon"
import Cog from "@heroicons/react/24/outline/Cog8ToothIcon"
import EnvelopeIcon from "@heroicons/react/24/outline/EnvelopeIcon"
import HeartIcon from "@heroicons/react/24/outline/HeartIcon"
import HeartIconSolid from "@heroicons/react/24/solid/HeartIcon"
import HomeModernIcon from "@heroicons/react/24/outline/HomeModernIcon"
import HouseIcon from "@heroicons/react/24/outline/HomeIcon"
import ListBulletIcon from "@heroicons/react/24/outline/ListBulletIcon"
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon"
import MapPinIcon from "@heroicons/react/24/outline/MapPinIcon"
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon"
import UserCircle from "@heroicons/react/24/outline/UserCircleIcon"
import { Application, Door, Profile } from "./CustomIcons"

export const CustomIconMap = {
  application: Application,
  chartBar: <ChartBarIcon />,
  chevronLeft: <ChevronLeftIcon />,
  clock: <Clock />,
  cog: <Cog />,
  door: Door,
  envelope: <EnvelopeIcon />,
  heartIcon: <HeartIcon />,
  heartIconSolid: <HeartIconSolid />,
  home: <HomeModernIcon />,
  house: <HouseIcon />,
  listBullet: <ListBulletIcon />,
  lockClosed: <LockClosedIcon />,
  mapPin: <MapPinIcon />,
  profile: Profile,
  questionMarkCircle: <QuestionMarkCircleIcon />,
  userCircle: <UserCircle />,
}

export type CustomIconType = keyof typeof CustomIconMap
