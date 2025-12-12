import React, { useState } from "react"
import { Button } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"

type ShowMoreSectionProps = {
  // Sets the default expanded state
  defaultExpanded?: boolean
  // Disables the show more/show less functionality
  disableShowMore?: boolean
  // Content to show when expanded
  fullContent: React.ReactNode
  // Content to show when minimized
  minimizedContent: React.ReactNode
  // Aria label for the show less button
  showLessAriaLabel: string
  // Aria label for the show more button
  showMoreAriaLabel: string
  // Unique ID for accessibility
  uniqueId: string
}

export const ShowMoreSection = (props: ShowMoreSectionProps) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <>
      <div id={props.uniqueId}>{expanded ? props.fullContent : props.minimizedContent}</div>
      {!props.disableShowMore && (
        <div className={"seeds-m-bs-2"}>
          <Button
            variant={"text"}
            onClick={() => setExpanded(!expanded)}
            ariaExpanded={expanded}
            ariaControls={props.uniqueId}
            ariaLabel={expanded ? props.showLessAriaLabel : props.showMoreAriaLabel}
          >
            {expanded ? t("t.showLess") : t("t.showMore")}
          </Button>
        </div>
      )}
    </>
  )
}
