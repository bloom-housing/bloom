import React from "react"
import "./ProgressNav.scss"
import { t } from "../helpers/translator"

const ProgressNavItem = (props: {
  section: number
  currentPageSection: number
  completedSections: number
  label: string
  mounted: boolean
  style: string
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
      <a
        aria-disabled={bgColor === "is-disabled"}
        aria-current={bgColor === "is-active"}
        href={"#"}
      >
        {props.label}
        {srText}
      </a>
    </li>
  )
}

const ProgressNav = (props: {
  currentPageSection: number
  completedSections: number
  labels: string[]
  mounted: boolean
  style?: string
}) => {
  return (
    <div aria-label="progress">
      <h2 className="sr-only">{t("progressNav.srHeading")}</h2>
      <ol className={!props.mounted ? "invisible" : `progress-nav progress-nav-${props.style}`}>
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
