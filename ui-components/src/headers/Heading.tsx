import * as React from "react"

export interface HeadingProps {
  children?: React.ReactNode
  className?: string
  underline?: boolean
  priority?: number
  style?: HeaderType
}

export type HeaderType = keyof typeof HeaderStyleMap

const HeaderStyleMap = {
  cardHeader: "card-header",
  cardSubheader: "card-subheader",
  tableHeader: "table-header",
  tableSubheader: "table-subheader",
  sidebarHeader: "text-caps-underline",
}

const Heading = (props: HeadingProps) => {
  const priority = props.priority && props.priority >= 1 && props.priority <= 6 ? props.priority : 1
  const Tag = `h${priority}` as keyof JSX.IntrinsicElements
  let classNames = `${props.style && HeaderStyleMap[props.style]} ${
    props.className && props.className
  }`
  if (props.underline) {
    classNames += " text-caps-underline"
  }
  return <Tag className={classNames}>{props.children}</Tag>
}

export { Heading as default, Heading }
