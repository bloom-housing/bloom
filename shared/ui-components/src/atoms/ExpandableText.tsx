import React, { useState } from "react"
import Markdown from "markdown-to-jsx"
import t from "../helpers/translator"
import "./ExpandableText.scss"

export interface ExpandableTextProps {
  children: string
  expand?: boolean
  maxLength?: number
  className?: string
}

const getText = (text: string, expanded: boolean, maxLength: number) => {
  if (expanded || text.length <= maxLength) {
    return text
  }

  let position = maxLength
  while (text[position] != " " && position > 0) {
    position -= 1
  }
  return position > 0 ? text.substring(0, position) + "..." : text.substring(0, maxLength) + "..."
}

const moreLessButton = (expanded: boolean, setExpanded: Function) => {
  return (
    <span className="button-toggle" onClick={() => setExpanded(!expanded)}>
      {expanded ? t("label.less") : t("label.more")}
    </span>
  )
}

const ExpandableText = (props: ExpandableTextProps) => {
  const [expanded, setExpanded] = useState(props.expand || false)
  const maxLength = props.maxLength || 350
  let button

  if (props.children.length > maxLength) {
    button = moreLessButton(expanded, setExpanded)
  }
  return (
    <span className="expandable-text">
      <p className={props.className}>
        <Markdown children={getText(props.children, expanded, maxLength)} />
        {button}
      </p>
    </span>
  )
}

export { ExpandableText as default, ExpandableText }
