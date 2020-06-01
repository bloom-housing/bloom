import * as React from "react"
import "./Description.scss"

export interface DescriptionProps {
  term: string
  description: any
}

export const Description = (props: DescriptionProps) => (
  <>
    <dd className="description__title">{props.term}</dd>
    <dt className="description__body">{props.description}</dt>
  </>
)
