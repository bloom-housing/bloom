import React from "react"
import { Heading } from "../text/Heading"
import "./HeadingGroup.scss"

export interface HeadingGroupProps {
  /** A string or element to display in an `h2` tag (overridable via `headingPriority`) */
  heading: React.ReactNode
  /** A string or element to display in a `p` tag */
  subheading: React.ReactNode
  /**
   * The heading level (1 through 6)
   * @default 2
   */
  headingPriority?: number
  /** Additional class name for the whole group */
  className?: string
}

const HeadingGroup = (props: HeadingGroupProps) => {
  const classNames = ["heading-group"]
  if (props.className) classNames.push(props.className)

  return (
    <hgroup className={classNames.join(" ")} role="group">
      <Heading priority={props.headingPriority ?? 2}>{props.heading}</Heading>
      <p>{props.subheading}</p>
    </hgroup>
  )
}

export { HeadingGroup as default, HeadingGroup }
