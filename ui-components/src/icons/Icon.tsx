import { AppearanceStyleType } from "../global/AppearanceTypes"
import * as React from "react"
import "./Icon.scss"

export interface IconProps {
  size: "tiny" | "small" | "medium" | "large" | "xlarge" | "2xl" | "3xl"
  symbol: string
  white?: boolean
  styleType?: AppearanceStyleType
  className?: string
}

const Icon = (props: IconProps) => {
  const wrapperClasses = ["ui-icon"]
  wrapperClasses.push(`ui-${props.size}`)

  if (props.white) wrapperClasses.push("ui-white")
  if (props.styleType) wrapperClasses.push(props.styleType)
  if (props.className) wrapperClasses.push(props.className)
  if (props.symbol == "spinner") wrapperClasses.push("spinner-animation")

  return (
    <span className={wrapperClasses.join(" ")}>
      <svg>
        <use xlinkHref={`#i-${props.symbol}`} />
      </svg>
    </span>
  )
}

export { Icon as default, Icon }
