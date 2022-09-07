import React from "react"
import "./Card.scss"

export interface CardHeaderProps {
  /** An additional element(s) you can add to the side of the main child element(s) */
  suffix?: React.ReactNode
  /** Additional class name */
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

export interface CardSectionProps {
  /**
   * Whether to center the text within the section
   * @default false
   */
  centered?: boolean
  /** Additional class name */
  className?: string
  children: React.ReactNode
}

const CardSection = (props: CardSectionProps) => {
  const classNames = ["card__section"]
  if (props.centered) classNames.push("text-center")
  if (props.className) classNames.push(props.className)

  return <div className={classNames.join(" ")}>{props.children}</div>
}

export interface CardFooterProps {
  /** Additional class name */
  className?: string
  children: React.ReactNode
}

const CardFooter = (props: CardFooterProps) => {
  const classNames = ["card__footer"]
  if (props.className) classNames.push(props.className)

  return <footer className={classNames.join(" ")}>{props.children}</footer>
}

export interface CardProps {
  /** Additional class name */
  className?: string
  children: React.ReactNode
}

const Card = (props: CardProps) => {
  const classNames = ["card"]
  if (props.className) classNames.push(props.className)

  return <article className={classNames.join(" ")}>{props.children}</article>
}

Card.Header = CardHeader
Card.Section = CardSection
Card.Footer = CardFooter

export { Card as default, Card, CardHeader, CardSection, CardFooter }
