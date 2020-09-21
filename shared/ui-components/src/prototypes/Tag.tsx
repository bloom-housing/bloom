import * as React from "react"
import "./Tag.scss"

export interface TagProps {
  children: React.ReactNode
  success?: boolean
}

const Tag = (props: TagProps) => {
  const tagClasses = ["tag"]
  if (props.success) tagClasses.push("is-success")

  return <div className={tagClasses.join(" ")}>{props.children}</div>
}

export { Tag as default, Tag }
