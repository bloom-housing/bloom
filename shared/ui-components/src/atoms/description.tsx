import * as React from "react"

interface DescriptionProps {
  term: string
  description: any
}

const Description = (props: DescriptionProps) => (
  <>
    <dd className="description__title">{props.term}</dd>
    <dt className="description__body">{props.description}</dt>
  </>
)

export { Description }
