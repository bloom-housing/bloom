import * as React from "react"

export interface HeadingProps {
  children?: React.ReactNode
  className?: string
  underline?: boolean
  priority?: number
}
const Heading = (props: HeadingProps) => {
  const Tag = `h${props.priority || 1}` as keyof JSX.IntrinsicElements
  let classNames = props.className || ""
  if (props.underline) {
    classNames += " text-caps-underline"
  }
  return <Tag className={classNames}>{props.children}</Tag>
}

export { Heading as default, Heading }
