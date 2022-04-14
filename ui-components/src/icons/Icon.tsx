import * as React from "react"
import "./Icon.scss"
import {
  Accessible,
  Application,
  ArrowBack,
  ArrowDown,
  ArrowForward,
  Assistance,
  Asterisk,
  BadgeCheck,
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
  Eye,
  Favorite,
  File,
  Filter,
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
  UniversalAccess,
  Warning,
} from "./Icons"

const IconMap = {
  accessible: Accessible,
  application: Application,
  arrowBack: ArrowBack,
  arrowForward: ArrowForward,
  arrowDown: ArrowDown,
  assistance: Assistance,
  asterisk: Asterisk,
  badgeCheck: BadgeCheck,
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
  eye: Eye,
  favorite: Favorite,
  file: File,
  filter: Filter,
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
  universalAccess: UniversalAccess,
  warning: Warning,
}

export type IconTypes = keyof typeof IconMap

export type IconFill = "white" | "primary"

export const IconFillColors = {
  white: "#ffffff",
  black: "#000000",
  primary: "#0077DA",
}

export type IconSize =
  | "tiny"
  | "small"
  | "base"
  | "medium"
  | "large"
  | "xlarge"
  | "2xl"
  | "3xl"
  | "extra-medium"

export interface IconProps {
  size: IconSize
  symbol: IconTypes
  className?: string
  fill?: string
  ariaHidden?: boolean
  iconClass?: string
  dataTestId?: string
}

const Icon = (props: IconProps) => {
  const wrapperClasses = ["ui-icon"]
  wrapperClasses.push(`ui-${props.size}`)
  if (props.className) wrapperClasses.push(props.className)
  if (props.symbol == "spinner") wrapperClasses.push("spinner-animation")

  const SpecificIcon = IconMap[props.symbol]

  return (
    <span
      className={wrapperClasses.join(" ")}
      aria-hidden={props.ariaHidden}
      data-test-id={props.dataTestId ?? null}
    >
      <SpecificIcon
        fill={props.fill ? props.fill : undefined}
        className={props.iconClass ?? undefined}
      />
    </span>
  )
}

export { Icon as default, Icon }
