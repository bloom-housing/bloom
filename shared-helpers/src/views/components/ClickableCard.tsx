import React from "react"
import { Card } from "@bloom-housing/ui-seeds"
import { CardProps } from "@bloom-housing/ui-seeds/src/blocks/Card"
import styles from "./ClickableCard.module.scss"

/**
 * ClickableCard transforms a Seeds Card component to be clickable, such that the full card is actionable based on a single internal anchor tag.
 * It must contain one anchor tag, and the full card will act as a link.
 * You are still able to add internal buttons, which will be separately actionable.
 * */
interface ClickableCardProps {
  /** Props to pass onto the Card component */
  cardProps?: Omit<CardProps, "children">
  /** Content within the Card wrapper */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

export const ClickableCard = (props: ClickableCardProps) => {
  return (
    <div className={styles["container"]}>
      <Card
        className={`${styles["clickable-card"]} ${props.className ? props.className : ""}`}
        {...props.cardProps}
      >
        {props.children}
      </Card>
    </div>
  )
}
