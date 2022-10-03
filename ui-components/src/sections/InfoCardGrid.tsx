import * as React from "react"
import { Heading } from "../text/Heading"
import "./InfoCardGrid.scss"

export interface InfoCardGridProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

const InfoCardGrid = (props: InfoCardGridProps) => (
  <section className="info-cards">
    <header className="info-cards__header">
      <Heading styleType={"underlineWeighted"} priority={2} className={"text-tiny"}>
        {props.title}
      </Heading>
      {props.subtitle && <p className="info-cards__subtitle">{props.subtitle}</p>}
    </header>
    <div className="info-cards__grid">{props.children}</div>
  </section>
)

export { InfoCardGrid as default, InfoCardGrid }
