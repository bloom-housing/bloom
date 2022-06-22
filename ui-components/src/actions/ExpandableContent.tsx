import React, { useState } from "react"
import "./ExpandableContent.scss"

type ExpandableContentProps = {
  children: React.ReactChild
  strings: {
    readMore?: string
    readLess?: string
  }
  className?: string
}

const ExpandableContent = ({ children, strings, className }: ExpandableContentProps) => {
  const classNames = ["expandable-content"]
  if (className) classNames.push(...className.split(" "))
  const [isExpanded, setExpanded] = useState(false)

  return (
    <div className={classNames}>
      <button
        type="button"
        className="button is-unstyled expandable-content-button no-underline has-toggle"
        aria-expanded={isExpanded}
        onClick={() => {
          setExpanded(!isExpanded)
        }}
      >
        {isExpanded ? strings.readLess : strings.readMore}
      </button>
      {isExpanded && <div className="expandable-content-container">{children}</div>}
    </div>
  )
}

export { ExpandableContent as default, ExpandableContent }
