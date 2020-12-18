import * as React from "react"
import { AppearanceProps, classNamesForAppearanceTypes } from "../global/AppearanceTypes"
import "./Tag.scss"

export interface TagProps extends AppearanceProps {
  pillStyle?: boolean
  children: React.ReactNode
}

const Tag = (props: TagProps) => {
  const tagClasses = ["tag"].concat(classNamesForAppearanceTypes(props))

  if (props.pillStyle) tagClasses.push("is-pill")

  return <span className={tagClasses.join(" ")}>{props.children}</span>
}

export { Tag as default, Tag }
