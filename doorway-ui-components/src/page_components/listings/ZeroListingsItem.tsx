import * as React from "react"
import { Heading } from "@bloom-housing/ui-components"
import "./ZeroListingsItem.scss"
import Markdown from "markdown-to-jsx"

export interface ZeroListingsItemProps {
  title: string
  description: string
  children?: React.ReactNode
  desktopClass?: string
}

export const ZeroListingsItem = (props: ZeroListingsItemProps) => (
  <div className="zero-listings">
    <Heading styleType={"largePrimary"} className="zero-listings-title">
      {props.title}
    </Heading>
    <div className="zero-listings-description">{props.description}</div>
    {typeof props.children == "string" ? (
      <div className="markdown info-card__content">
        <Markdown options={{ disableParsingRawHTML: true }} children={props.children} />
      </div>
    ) : (
      props.children
    )}
  </div>
)
