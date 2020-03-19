import * as React from "react"
import "./InfoCard.scss"

export interface InfoCardProps {
  title: string
  children: JSX.Element
}

const InfoCard = (props: InfoCardProps) => (
  <div className="info-card">
    <h4 className="info-card__title">{props.title}</h4>

    {props.children}
  </div>
)

export { InfoCard as default, InfoCard }
