import * as React from "react"
import { AppearanceProps, classNamesForAppearanceTypes } from "../global/AppearanceTypes"
import "./Tag.scss"

export interface TagProps extends AppearanceProps {
  className?: string
  pillStyle?: boolean
  capitalized?: boolean
  children: React.ReactNode
  fillContainer?: boolean
}

export const Tag = (props: TagProps) => {
  const tagClasses = ["tag"].concat(classNamesForAppearanceTypes(props))

  if (props.pillStyle) tagClasses.push("is-pill")
  if (props.fillContainer) tagClasses.push("fill-container")
  if (props.capitalized) tagClasses.push("is-capitalized")
  if (props.className) tagClasses.push(props.className)

  return <span className={tagClasses.join(" ")}>{props.children}</span>
}
