import React from "react"
import "./Card.scss"

interface CardHeaderProps {
  suffix?: React.ReactNode
  children: React.ReactNode
}

const CardHeader: React.FunctionComponent<CardHeaderProps> = (props: CardHeaderProps) => {
  const classNames = ["card__header"]
  if (props.suffix) classNames.push("is-flex")
  return (
    <header className={classNames.join(" ")}>
      <hgroup role="group">{props.children}</hgroup>
      {props.suffix}
    </header>
  )
}

interface CardSectionProps {
  centered?: boolean
  className?: string
  children: React.ReactNode
}

const CardSection: React.FunctionComponent<CardSectionProps> = (props: CardSectionProps) => {
  const classNames = ["card__section"]
  if (props.centered) classNames.push("text-center")
  if (props.className) classNames.push(props.className)
  return <div className={classNames.join(" ")}>{props.children}</div>
}

const CardFooter: React.FunctionComponent = ({ children }) => {
  return <footer className="card__footer">{children}</footer>
}

interface CardProps {
  children: React.ReactNode
}

const Card = (props: CardProps) => {
  const cardClasses = ["card"]

  return <article className={cardClasses.join(" ")}>{props.children}</article>
}

Card.Header = CardHeader
Card.Section = CardSection
Card.Footer = CardFooter

export { Card as default, Card, CardHeader, CardSection, CardFooter }
