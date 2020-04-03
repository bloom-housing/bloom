import * as React from "react"
import "./InfoCard.scss"

export interface InfoCardProps {
  title: string
  externalHref?: string
  children: JSX.Element
}

const InfoCard = (props: InfoCardProps) => (
  <div className="info-card">
    {props.externalHref ? (
      <h4 className="info-card__title">
        <a href={props.externalHref} target="_blank">
          {props.title}
        </a>
      </h4>
    ) : (
      <h4 className="info-card__title">{props.title}</h4>
    )}
    {props.children}
  </div>
)

export { InfoCard as default, InfoCard }
