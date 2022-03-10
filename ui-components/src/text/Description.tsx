import * as React from "react"
import "./Description.scss"
import Markdown from "markdown-to-jsx"

export interface DescriptionProps {
  term: string
  description: string | React.ReactNode
  markdown?: boolean
}

export const Description = (props: DescriptionProps) => {
  return (
    <div className={"description__container"}>
      <dd className="description__title">{props.term}</dd>
      {props.markdown ? (
        <dt className="description__body">
          <Markdown
            options={{ disableParsingRawHTML: true }}
            children={props.description as string}
          />
        </dt>
      ) : (
        <dt className="description__body">{props.description}</dt>
      )}
    </div>
  )
}
