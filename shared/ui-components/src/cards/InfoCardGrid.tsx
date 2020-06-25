import * as React from "react"
import "./InfoCardGrid.scss"

export interface InfoCardGridProps {
  title: string
  subtitle?: string
  children: JSX.Element | JSX.Element[]
}

const InfoCardGrid = (props: InfoCardGridProps) => (
  <section className="info-cards">
    <header className="info-cards__header">
      <h2 className="info-cards__title">{props.title}</h2>
      <p className="info-cards__subtitle">{props.subtitle}</p>
    </header>
    <div className="info-cards__grid">{props.children}</div>
  </section>
)

export { InfoCardGrid as default, InfoCardGrid }
