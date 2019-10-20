import * as React from "react"

interface InfoCardProps {
  title: string
  children: JSX.Element
}

const InfoCard = (props: InfoCardProps) => (
  <div className="info-card">
    <h4 className="info-card__title">{props.title}</h4>

    {props.children}
  </div>
)

export default InfoCard
