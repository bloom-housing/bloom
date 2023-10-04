import React from "react"
import "./ProgressNav.scss"
import { t } from "@bloom-housing/ui-components"

type ProgressNavStyle = "bar" | "dot"

const ProgressNavItem = (props: {
  section: number
  currentPageSection: number
  completedSections: number
  label: string
  mounted: boolean
  style: ProgressNavStyle
  strings?: {
    screenReaderCompleted?: string
    screenReaderNotCompleted?: string
    screenReaderTitle?: string
  }
}) => {
  let bgColor = "is-disabled"
  if (props.mounted) {
    if (props.section === props.currentPageSection) {
      bgColor = "is-active"
    } else if (props.completedSections >= props.section) {
      bgColor = ""
    }
  }

  const srTextBuilder = (): string | React.ReactNode => {
    if (props.section < props.currentPageSection) {
      return (
        <span className="sr-only">
          {props.strings?.screenReaderCompleted ?? t("progressNav.completed")}
        </span>
      )
    } else if (props.section > props.currentPageSection) {
      return (
        <span className="sr-only">
          {props.strings?.screenReaderNotCompleted ?? t("progressNav.notCompleted")}
        </span>
      )
    } else {
      return ""
    }
  }

  return (
    <li className={`progress-nav__${props.style}-item ${bgColor}`}>
      <span
        aria-disabled={bgColor === "is-disabled"}
        aria-current={bgColor === "is-active"}
        className={"progress-nav__item-container"}
      >
        {props.label} {srTextBuilder()}
      </span>
    </li>
  )
}

const ProgressNav = (props: {
  currentPageSection: number
  completedSections: number
  removeSrHeader?: boolean
  labels: string[]
  mounted: boolean
  style?: ProgressNavStyle
  strings?: {
    screenReaderHeading?: string
  }
}) => {
  let navClasses = "progress-nav"
  if (props.style === "bar") navClasses += " progress-nav__bar"
  return (
    <div aria-label={"progress"}>
      {!props.removeSrHeader && (
        <h2 className="sr-only">
          {props.strings?.screenReaderHeading ?? t("progressNav.srHeading")}
        </h2>
      )}
      <ol className={!props.mounted ? "invisible" : navClasses}>
        {props.labels.map((label, i) => (
          <ProgressNavItem
            key={label}
            section={i + 1}
            currentPageSection={props.currentPageSection}
            completedSections={props.completedSections}
            label={label}
            mounted={props.mounted}
            style={props.style ?? "dot"}
          />
        ))}
      </ol>
    </div>
  )
}

export { ProgressNav as default, ProgressNav }
