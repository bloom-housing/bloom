import * as React from "react"

interface ListSectionProps {
  title: string
  subtitle: string
  children?: JSX.Element
}

const ListSection = (props: ListSectionProps) => (
  <li className="custom-counter_item">
    <header className="custom-counter_header mb-4 mt-4">
      <hgroup>
        <h4 className="text-1xl">{props.title}</h4>
        <span className="text-gray-700 text-tiny">{props.subtitle}</span>
      </hgroup>
    </header>

    {props.children}
  </li>
)

export default ListSection
