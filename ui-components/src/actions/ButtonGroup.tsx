import React from "react"
import "./ButtonGroup.scss"

export enum ButtonGroupSpacing {
  between = "between",
  even = "even",
}

export interface ButtonGroupProps {
  /** Pass either Button components in, or fragments which can contain one or more buttons */
  columns: React.ReactNodeArray
  /** Between spacing pushes the columns far apart, even spacing keeps them closer together */
  spacing?: ButtonGroupSpacing
  /** When true, buttons will collapse to a single column on small screens and go full-width */
  fullwidthMobile?: boolean
  /** When true, the flex ordering of columns will reverse (aka RTL) */
  reversed?: boolean
}

const ButtonGroup = ({
  spacing = ButtonGroupSpacing.between,
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
