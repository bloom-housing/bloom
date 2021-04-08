import * as React from "react"
import "./Icon.scss"

export interface IconProps {
  size: "tiny" | "small" | "medium" | "large" | "xlarge" | "2xl"
  symbol: string
  white?: boolean
  className?: string
}

const Icon = (props: IconProps) => {
  const wrapperClasses = ["ui-icon"]
  wrapperClasses.push(`ui-${props.size}`)

  if (props.white) {
    wrapperClasses.push("ui-white")
  }

  if (props.className) {
    wrapperClasses.push(props.className)
  }

  return (
    <span className={wrapperClasses.join(" ")}>
      <svg>
        <use xlinkHref={`#i-${props.symbol}`} />
      </svg>
    </span>
  )
}

export { Icon as default, Icon }
