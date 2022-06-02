import React from "react"
import { Heading } from "../headers/Heading"
import "./StandardCard.scss"

export interface StandardCardProps {
  title?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  emptyStateMessage: string
}

const StandardCard = ({ title, children, footer, emptyStateMessage }: StandardCardProps) => {
  return (
    <div className="standard-card">
      <div className="standard-card__inner">
        {title && (
          <Heading className="standard-card__title" priority={3}>
            {title}
          </Heading>
        )}

        {children ? children : <div className="standard-card__blank">{emptyStateMessage}</div>}
      </div>

      {footer && <div className="standard-card__footer">{footer}</div>}
    </div>
  )
}

export { StandardCard as default, StandardCard }
