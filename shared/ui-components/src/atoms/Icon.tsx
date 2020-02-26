import * as React from "react"
import "./Icon.scss"

export interface IconProps {
  size: string
  symbol: string
}

const Icon = (props: IconProps) => {
  const wrapperClasses = ["ui-icon"]
  wrapperClasses.push(`ui-${props.size}`)

  return (
    <span className={wrapperClasses.join(" ")}>
      <svg>
        <use xlinkHref={`#i-${props.symbol}`} />
      </svg>
    </span>
  )
}

export default Icon
