import * as React from "react"

export interface HeadingProps {
  children?: React.ReactNode
  className?: string
  underline?: boolean
  priority?: number
}
const Heading = (props: HeadingProps) => {
  const priority = props.priority && props.priority >= 1 && props.priority <= 6 ? props.priority : 1
  const Tag = `h${priority}` as keyof JSX.IntrinsicElements
  let classNames = props.className || ""
  if (props.underline) {
    classNames += " text-caps-underline"
  }
  return <Tag className={classNames}>{props.children}</Tag>
}

export { Heading as default, Heading }
