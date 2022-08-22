import React, { useState } from "react"
import Markdown, { MarkdownOptions } from "markdown-to-jsx"
import "./ExpandableText.scss"

export interface ExpandableTextProps {
  children: string
  expand?: boolean
  maxLength?: number
  className?: string
  strings: {
    readMore: string
    readLess: string
  }
  markdownProps?: MarkdownOptions
  buttonClassName?: string
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
  strings: ExpandableTextProps["strings"],
  buttonClassName: ExpandableTextProps["buttonClassName"]
) => {
  const classes = ["button-toggle ml-4"]
  if (buttonClassName) {
    classes.push(buttonClassName)
  }

  return (
    <button className={classes.join(" ")} onClick={() => setExpanded(!expanded)}>
      {expanded ? strings?.readLess : strings?.readMore}
    </button>
  )
}

const ExpandableText = (props: ExpandableTextProps) => {
  const [expanded, setExpanded] = useState(props.expand || false)
  const maxLength = props.maxLength || 350
  let button

  if (!props.children) return null

  if (props.children.length > maxLength) {
    button = moreLessButton(expanded, setExpanded, props.strings, props.buttonClassName)
  }
  return (
    <div className={`expandable-text ${props?.className}`}>
      {" "}
      <Markdown
        children={getText(props.children, expanded, maxLength)}
        options={props.markdownProps}
      />
      {button}
    </div>
  )
}

export { ExpandableText as default, ExpandableText }
