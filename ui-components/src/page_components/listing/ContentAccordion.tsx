import React, { useState, useRef } from "react"
import { Icon, IconFillColors } from "../../icons/Icon"
import "./ContentAccordion.scss"

interface UnitTablesProps {
  customBarContent?: React.ReactNode
  customExpandedContent?: React.ReactNode
  disableAccordion?: boolean
  accordionTheme?: AccordionTheme
  barClass?: string
}

export type AccordionTheme = "blue" | "gray"

/**
 * An accordion that consists of a header bar and an expandable content section
 * Two existing themes under our design system are available as is flexibility to add custom styles
 */
const ContentAccordion = (props: UnitTablesProps) => {
  const [accordionOpen, setAccordionOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const toggleTable = async () => {
    if (!props.disableAccordion) {
      await setAccordionOpen(!accordionOpen)
      buttonRef?.current?.focus()
    }
  }

  return (
    <div className={`mb-4`}>
      <button
        onClick={toggleTable}
        className={`w-full text-left ${props.disableAccordion && "cursor-default"}`}
        ref={buttonRef}
        aria-expanded={accordionOpen}
      >
        <div
          className={`flex justify-between ${props.barClass} ${
            props.accordionTheme === "blue" && "accordion-blue-theme__bar"
          } ${props.accordionTheme === "gray" && "accordion-gray-theme__bar"} ${
            accordionOpen && "accordion-open"
          }`}
        >
          {props.customBarContent}
          {!props.disableAccordion && (
            <>
              {accordionOpen ? (
                <Icon
                  symbol={"closeSmall"}
                  size={"base"}
                  fill={IconFillColors.primary}
                  dataTestId={"accordion-close"}
                />
              ) : (
                <Icon
                  symbol={"arrowDown"}
                  size={"base"}
                  fill={IconFillColors.primary}
                  dataTestId={"accordion-open"}
                />
              )}
            </>
          )}
        </div>
      </button>
      {accordionOpen && <div>{props.customExpandedContent}</div>}
    </div>
  )
}

export { ContentAccordion as default, ContentAccordion }
