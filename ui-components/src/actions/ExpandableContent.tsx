import React, { useState } from "react"

type ExpandableContentProps = {
  children: React.ReactChild
  strings: {
    readMore?: string
    readLess?: string
  }
  className?: string
}

const ExpandableContent = ({ children, strings, className }: ExpandableContentProps) => {
  const [isExpanded, setExpanded] = useState(false)
  const rootClassNames = className ? `${className}` : undefined

  return (
    <div className={rootClassNames}>
      <button
        type="button"
        className="button is-unstyled m-0 no-underline has-toggle"
        aria-expanded={isExpanded}
        onClick={() => {
          setExpanded(!isExpanded)
        }}
      >
        {isExpanded ? strings.readLess : strings.readMore}
      </button>
      {isExpanded && <div className="mt-6">{children}</div>}
    </div>
  )
}

export { ExpandableContent as default, ExpandableContent }
