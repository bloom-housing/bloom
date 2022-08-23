import React from "react"
import "./ProgressNav.scss"
import { t } from "../helpers/translator"

type ProgressNavStyle = "bar" | "dot"

const ProgressNavItem = (props: {
  section: number
  currentPageSection: number
  completedSections: number
  label: string
  mounted: boolean
  style: ProgressNavStyle
}) => {
  let bgColor = "is-disabled"
  if (props.mounted) {
    if (props.section === props.currentPageSection) {
      bgColor = "is-active"
    } else if (props.completedSections >= props.section) {
      bgColor = ""
    }
  }

  const srText =
    props.section === props.currentPageSection ? (
      <span className="sr-only">{t("progressNav.current")}</span>
    ) : (
      ""
    )

  return (
    <li className={`progress-nav__${props.style}-item ${bgColor}`}>
      <span
        aria-disabled={bgColor === "is-disabled"}
        aria-current={bgColor === "is-active"}
        tabIndex={0}
        className={"progress-nav__item-container"}
      >
        {props.label}
        {srText}
      </span>
    </li>
  )
}

const ProgressNav = (props: {
  currentPageSection: number
  completedSections: number
  labels: string[]
  mounted: boolean
  style?: ProgressNavStyle
}) => {
  let navClasses = "progress-nav"
  if (props.style === "bar") navClasses += " progress-nav__bar"
  return (
    <div aria-label="progress">
      <h2 className="sr-only">{t("progressNav.srHeading")}</h2>
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
