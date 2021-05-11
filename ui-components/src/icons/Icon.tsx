import { AppearanceStyleType } from "../global/AppearanceTypes"
import * as React from "react"
import "./Icon.scss"
import { Favorite, Close, Phone } from "../../public/images/icons"

const IconMap = {
  phone: Phone,
  favorite: Favorite,
  close: Close,
}

type IconTypes = keyof typeof IconMap

export interface IconProps {
  size: "tiny" | "small" | "medium" | "large" | "xlarge" | "2xl" | "3xl"
  symbol: IconTypes
  white?: boolean
  styleType?: AppearanceStyleType
  className?: string
  fill?: string
}

const Icon = (props: IconProps) => {
  const wrapperClasses = ["ui-icon", "relative"]
  wrapperClasses.push(`ui-${props.size}`)
  if (props.white) wrapperClasses.push("ui-white")
  if (props.styleType) wrapperClasses.push(props.styleType)
  if (props.className) wrapperClasses.push(props.className)
  if (props.symbol == "spinner") wrapperClasses.push("spinner-animation")

  const SpecificIcon = IconMap[props.symbol]

  return (
    <span className={wrapperClasses.join(" ")}>
      <SpecificIcon fill={props.fill} />
    </span>
  )
}

export { Icon as default, Icon }
