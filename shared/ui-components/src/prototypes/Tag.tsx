import * as React from "react"
import "./Tag.scss"

export interface TagProps {
  children: React.ReactNode
  success?: boolean
  warning?:boolean
  small?:boolean
  pillStyle?:boolean
}

const Tag = (props: TagProps) => {
  const tagClasses = ["tag"]
  if (props.success) tagClasses.push("is-success")
  if (props.warning) tagClasses.push("is-warning")
  if (props.small) tagClasses.push("is-small")
  if (props.pillStyle) tagClasses.push("is-pill")

  return <div className={tagClasses.join(" ")}>{props.children}</div>
}

export { Tag as default, Tag }
