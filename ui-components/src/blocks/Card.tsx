import React from "react"
import { Heading } from "../headers/Heading"
import "./Card.scss"

interface CardHeaderProps {
  suffix?: React.ReactNode
  className?: string
  children: React.ReactNode
}

const CardHeader = (props: CardHeaderProps) => {
  const classNames = ["card__header"]
  if (props.suffix) classNames.push("is-flex")
  if (props.className) classNames.push(props.className)

  return (
    <header className={classNames.join(" ")}>
      {props.children}
      {props.suffix}
    </header>
  )
}

interface CardHeadingGroupProps {
  /** A string or element to display in an `h2` tag (overridable via `headingPriority`) */
  heading: React.ReactNode
  /** A string or element to display in an `p` tag (using `aria-roledescription="subtitle"`) */
  subheading: React.ReactNode
  /**
   * The heading level (1 through 6)
   * @default 2
   */
  headingPriority?: number
  /** Additional class name for the heading */
  headingClassName?: string
  /** Additional class name for the subheading */
  subheadingClassName?: string
}

const CardHeadingGroup = (props: CardHeadingGroupProps) => {
  return (
    <hgroup role="group">
      <Heading className={props.headingClassName} priority={props.headingPriority ?? 2}>
        {props.heading}
      </Heading>
      <p className={props.subheadingClassName} aria-roledescription="subtitle">
        {props.subheading}
      </p>
    </hgroup>
  )
}

interface CardSectionProps {
  /**
   * Whether to center the text within the section
   * @default false
   */
  centered?: boolean
  className?: string
  children: React.ReactNode
}

const CardSection = (props: CardSectionProps) => {
  const classNames = ["card__section"]
  if (props.centered) classNames.push("text-center")
  if (props.className) classNames.push(props.className)

  return <div className={classNames.join(" ")}>{props.children}</div>
}

interface CardFooterProps {
  className?: string
  children: React.ReactNode
}

const CardFooter = (props: CardFooterProps) => {
  const classNames = ["card__footer"]
  if (props.className) classNames.push(props.className)

  return <footer className={classNames.join(" ")}>{props.children}</footer>
}

interface CardProps {
  className?: string
  children: React.ReactNode
}

const Card = (props: CardProps) => {
  const classNames = ["card"]
  if (props.className) classNames.push(props.className)

  return <article className={classNames.join(" ")}>{props.children}</article>
}

Card.Header = CardHeader
Card.HeadingGroup = CardHeadingGroup
Card.Section = CardSection
Card.Footer = CardFooter

export { Card as default, Card, CardHeader, CardHeadingGroup, CardSection, CardFooter }
