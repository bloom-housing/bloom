import * as React from "react"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./Icon.scss"
import {
  Application,
  ArrowBack,
  ArrowDown,
  ArrowForward,
  Assistance,
  Asterisk,
  Bed,
  Browse,
  Building,
  Calendar,
  Check,
  Clock,
  Close,
  CloseRound,
  CloseSmall,
  Cross,
  Document,
  DoubleHouse,
  Down,
  Download,
  Draggable,
  Edit,
  Eligibility,
  Envelope,
  Eye,
  Favorite,
  File,
  Forward,
  FrontDoor,
  Globe,
  Hamburger,
  House,
  Info,
  Left,
  Lightbulb,
  Like,
  LikeFill,
  Link,
  List,
  Lock,
  Mail,
  MailThin,
  Map,
  MapThin,
  Menu,
  Messages,
  Oval,
  Phone,
  Plus,
  Polygon,
  Profile,
  Question,
  Result,
  Right,
  Search,
  Settings,
  Spinner,
  Star,
  Ticket,
  Trash,
  Warning,
} from "./Icons"

const IconMap = {
  application: Application,
  arrowBack: ArrowBack,
  arrowForward: ArrowForward,
  arrowDown: ArrowDown,
  assistance: Assistance,
  asterisk: Asterisk,
  bed: Bed,
  browse: Browse,
  building: Building,
  calendar: Calendar,
  check: Check,
  clock: Clock,
  close: Close,
  closeRound: CloseRound,
  closeSmall: CloseSmall,
  cross: Cross,
  document: Document,
  doubleHouse: DoubleHouse,
  down: Down,
  download: Download,
  draggable: Draggable,
  edit: Edit,
  eligibility: Eligibility,
  envelope: Envelope,
  eye: Eye,
  favorite: Favorite,
  file: File,
  forward: Forward,
  frontDoor: FrontDoor,
  globe: Globe,
  hamburger: Hamburger,
  house: House,
  info: Info,
  left: Left,
  lightbulb: Lightbulb,
  like: Like,
  likeFill: LikeFill,
  link: Link,
  list: List,
  lock: Lock,
  mail: Mail,
  mailThin: MailThin,
  map: Map,
  mapThin: MapThin,
  menu: Menu,
  messages: Messages,
  oval: Oval,
  phone: Phone,
  plus: Plus,
  polygon: Polygon,
  profile: Profile,
  question: Question,
  result: Result,
  right: Right,
  search: Search,
  settings: Settings,
  spinner: Spinner,
  star: Star,
  ticket: Ticket,
  trash: Trash,
  warning: Warning,
}

export type IconTypes = keyof typeof IconMap

export type IconFill = "white" | "primary"

export const IconFillColors = {
  white: "#ffffff",
  black: "#000000",
  primary: "#0077DA",
}

export type IconSize = "tiny" | "small" | "base" | "medium" | "large" | "xlarge" | "2xl" | "3xl"

export interface IconProps {
  size: IconSize
  symbol: IconTypes | IconDefinition
  className?: string
  fill?: string
  ariaHidden?: boolean
  dataTestId?: string
}

const Icon = (props: IconProps) => {
  const wrapperClasses = ["ui-icon"]
  wrapperClasses.push(`ui-${props.size}`)
  if (props.className) wrapperClasses.push(props.className)
  if (props.symbol == "spinner") wrapperClasses.push("spinner-animation")

  const SpecificIcon =
    typeof props.symbol === "string" ? (
      IconMap[props.symbol as string]
    ) : (
      <FontAwesomeIcon icon={props.symbol} />
    )

  console.info(typeof props.symbol === "string", SpecificIcon)
  return typeof props.symbol === "string" ? (
    <span
      className={wrapperClasses.join(" ")}
      aria-hidden={props.ariaHidden}
      data-test-id={props.dataTestId ?? null}
    >
      <SpecificIcon fill={props.fill ? props.fill : undefined} />
    </span>
  ) : (
    <span
      className={wrapperClasses.join(" ")}
      aria-hidden={props.ariaHidden}
      data-test-id={props.dataTestId ?? null}
      style={{ color: props.fill }}
    >
      {SpecificIcon}
    </span>
  )
}

export { Icon as default, Icon }
