import * as React from "react"
import "./Icon.scss"

export interface IconProps {
  size: string
  symbol: string
  white?: boolean
}

const Icon = (props: IconProps) => {
  const wrapperClasses = ["ui-icon"]
  wrapperClasses.push(`ui-${props.size}`)

  if (props.white) {
    wrapperClasses.push("ui-white")
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
