import React from "react"
import { Application, Door, Profile } from "./CustomIcons"
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon"
import ChevronLeftIcon from "@heroicons/react/20/solid/ChevronLeftIcon"
import Clock from "@heroicons/react/24/outline/ClockIcon"
import HeartIcon from "@heroicons/react/24/outline/HeartIcon"
import HeartIconSolid from "@heroicons/react/24/solid/HeartIcon"
import HomeModernIcon from "@heroicons/react/24/outline/HomeModernIcon"
import HouseIcon from "@heroicons/react/24/outline/HomeIcon"
import EnvelopeIcon from "@heroicons/react/24/outline/EnvelopeIcon"
import MapPinIcon from "@heroicons/react/24/outline/MapPinIcon"
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon"
import ListBulletIcon from "@heroicons/react/24/outline/ListBulletIcon"
import UserCircle from "@heroicons/react/24/outline/UserCircleIcon"
import Cog from "@heroicons/react/24/outline/Cog8ToothIcon"

export const CustomIconMap = {
  application: Application,
  profile: Profile,
  door: Door,
  lockClosed: <LockClosedIcon />,
  chevronLeft: <ChevronLeftIcon />,
  clock: <Clock />,
  heartIcon: <HeartIcon />,
  heartIconSolid: <HeartIconSolid />,
  home: <HomeModernIcon />,
  envelope: <EnvelopeIcon />,
  mapPin: <MapPinIcon />,
  house: <HouseIcon />,
  questionMarkCircle: <QuestionMarkCircleIcon />,
  listBullet: <ListBulletIcon />,
  userCircle: <UserCircle />,
  cog: <Cog />,
}

export type CustomIconType = keyof typeof CustomIconMap
