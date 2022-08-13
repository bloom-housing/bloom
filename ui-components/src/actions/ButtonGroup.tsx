import React from "react"
import "./ButtonGroup.scss"

export enum ButtonGroupSpacing {
  between = "between",
  even = "even",
}

export interface ButtonGroupProps {
  columns: React.ReactNodeArray
  spacing?: ButtonGroupSpacing
  fullwidthMobile?: boolean
  reversed?: boolean
}

const ButtonGroup = ({
  spacing = "between",
  columns,
  fullwidthMobile,
  reversed,
}: ButtonGroupProps) => {
  const spacingClassName = `has-${spacing}-spacing`
  const classNames = ["button-group", spacingClassName]
  if (fullwidthMobile) classNames.push("has-fullwidth-mobile-buttons")
  if (reversed) classNames.push("is-reversed")

  return (
    <div className={classNames.join(" ")}>
      {columns.map((column) => (
        <div className="button-group__column">{column}</div>
      ))}
    </div>
  )
}

export { ButtonGroup as default, ButtonGroup }
