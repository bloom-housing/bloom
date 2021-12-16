import * as React from "react"
import { Icon, IconProps } from "../icons/Icon"
import { AppearanceProps, classNamesForAppearanceTypes } from "../global/AppearanceTypes"
import "./Tag.scss"

export interface TagProps extends AppearanceProps {
  className?: string
  pillStyle?: boolean
  children: React.ReactNode
  fillContainer?: boolean
  icon?: IconProps
}

const Tag = (props: TagProps) => {
  const tagClasses = ["tag"].concat(classNamesForAppearanceTypes(props))

  if (props.pillStyle) tagClasses.push("is-pill")
  if (props.fillContainer) tagClasses.push("fill-container")
  if (props.className) tagClasses.push(props.className)

  return (
    <span className={tagClasses.join(" ")}>
      {props.icon && <Icon {...props.icon} className="tag__icon" />}
      {props.children}
    </span>
  )
}

export { Tag as default, Tag }
