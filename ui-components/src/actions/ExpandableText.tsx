import React, { useState } from "react"
import Markdown from "markdown-to-jsx"
import "./ExpandableText.scss"

export interface ExpandableTextProps {
  children: string
  expand?: boolean
  maxLength?: number
  className?: string
  strings: {
    readMore?: string
    readLess?: string
  }
  markdownProps?: {
    disableParsingRawHTML: boolean
  }
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

const moreLessButton = (
  expanded: boolean,
  setExpanded: (newValue: boolean) => void,
  strings: ExpandableTextProps.strings
) => {
  return (
    <span className="button-toggle" onClick={() => setExpanded(!expanded)}>
      {expanded ? strings?.readLess : strings?.readMore}
    </span>
  )
}

const ExpandableText = (props: ExpandableTextProps) => {
  const [expanded, setExpanded] = useState(props.expand || false)
  const maxLength = props.maxLength || 350
  let button

  if (!props.children) return null

  if (props.children.length > maxLength) {
    button = moreLessButton(expanded, setExpanded, props.strings)
  }
  return (
    <div className={`expandable-text ${props.className}`}>
      {" "}
      <Markdown
        children={getText(props.children, expanded, maxLength)}
        options={{
          disableParsingRawHTML: props.markdownProps?.disableParsingRawHTML,
        }}
      />
      {button}
    </div>
  )
}

export { ExpandableText as default, ExpandableText }
