import * as React from "react"
import "./ListSection.scss"

export interface ListSectionProps {
  title: string
  subtitle: string
  children?: React.ReactNode
  id?: string
}

const ListSection = (props: ListSectionProps) => (
  <li id={props.id} className="list-section custom-counter__item">
    <header className="list-section__header custom-counter__header">
      <hgroup>
        <h4 className="custom-counter__title">{props.title}</h4>
        <span className="custom-counter__subtitle">{props.subtitle}</span>
      </hgroup>
    </header>

    {props.children}
  </li>
)

export { ListSection as default, ListSection }
