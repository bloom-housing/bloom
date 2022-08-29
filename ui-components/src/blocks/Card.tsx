import React from "react"
import "./Card.scss"

const CardHeader: React.FunctionComponent = ({ children }) => {
  return <header className="card__header">{children}</header>
}

const CardSection: React.FunctionComponent = (props) => {
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

export { Card as default, Card }
