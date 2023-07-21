import React, { useState } from "react"
import { Heading } from "../.."
import "./DoorwayCollapsibleSection.scss"

type DoorwayCollapsibleSectionProps = {
  title: string
  children: React.ReactNode
  customAnchor?: string
  className?: string
}

const DoorwayCollapsibleSection = ({
  children,
  title,
  className,
}: DoorwayCollapsibleSectionProps) => {
  const [isExpanded, setExpanded] = useState(false)
  const rootClassNames = className ? `${className}` : ""

  return (
    <div
      className={`doorway-collapsible-section ${rootClassNames}`}
      onClick={() => {
        setExpanded(!isExpanded)
      }}
    >
      <div className="doorway-collapsible-section_heading-container">
        <button
          type="button"
          className="button is-unstyled m-0 no-underline has-toggle flex items-center"
          aria-expanded={isExpanded}
        >
          <Heading priority={4} className={"text__large-primary"}>
            {title}
          </Heading>
        </button>
      </div>
      {isExpanded && <div className="doorway-collapsible-section_section">{children}</div>}
    </div>
  )
}

export { DoorwayCollapsibleSection as default, DoorwayCollapsibleSection }
