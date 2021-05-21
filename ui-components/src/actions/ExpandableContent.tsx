import React, { useState } from "react"
import { t } from "@bloom-housing/ui-components"

type ExpandableContentProps = {
  children: React.ReactChild
}

const ExpandableContent = ({ children }: ExpandableContentProps) => {
  const [isExpanded, setExpanded] = useState(false)

  return (
    <div>
      <button
        type="button"
        className="button is-unstyled m-0 no-underline has-toggle"
        aria-expanded={isExpanded}
        onClick={() => {
          setExpanded(!isExpanded)
        }}
      >
        {t(isExpanded ? "t.readLess" : "t.readMore")}
      </button>

      {isExpanded && <div className="mt-6">{children}</div>}
    </div>
  )
}

export { ExpandableContent as default, ExpandableContent }
