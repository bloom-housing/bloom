import React, { useState } from "react"
import { Heading } from "@bloom-housing/ui-components"
import styles from "./DoorwayCollapsibleSection.module.scss"

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
      className={`${styles["doorway-collapsible-section"]} ${rootClassNames}`}
      onClick={() => {
        setExpanded(!isExpanded)
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          setExpanded(!isExpanded)
        }
      }}
    >
      <div className={styles["doorway-collapsible-section_heading-container"]}>
        <button
          type="button"
          className="button is-unstyled m-0 no-underline flex items-center"
          aria-expanded={isExpanded}
        >
          <Heading priority={4} className={"text__large-primary text-left"}>
            {title}
          </Heading>
        </button>
      </div>
      {isExpanded && (
        <div className={styles["doorway-collapsible-section_section"]}>{children}</div>
      )}
    </div>
  )
}

export { DoorwayCollapsibleSection as default, DoorwayCollapsibleSection }
