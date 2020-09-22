import * as React from "react"
import "./ViewItem.scss"

export interface ViewItemProps {
  label?: string
  value?: string
  helper?: string
  flagged?: boolean
  className?: string
}

const ViewItem = (props: ViewItemProps) => {
  const viewItemClasses = ["view-item"]
  if (props.flagged) viewItemClasses.push("is-flagged")
  if (props.className) viewItemClasses.push(props.className)

  return (
    <p className={viewItemClasses.join(" ")}>
      <span className="view-item__label">{props.label}</span>
      <span className="view-item__value">{props.value}</span>
      {props.helper && <span className="view-item__helper">{props.helper}</span>}
    </p>
  )
}

export { ViewItem as default, ViewItem }
