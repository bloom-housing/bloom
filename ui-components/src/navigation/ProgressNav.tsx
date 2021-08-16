import React from "react"
import { OnClientSide } from "../helpers/nextjs"
import "./ProgressNav.scss"

const ProgressNavItem = (props: {
  section: number
  currentPageSection: number
  completedSections: number
  label: string
}) => {
  let bgColor = "is-disabled"
  if (OnClientSide()) {
    if (props.section === props.currentPageSection) {
      bgColor = "is-active"
    } else if (props.completedSections >= props.section) {
      bgColor = ""
    }
  }

  return (
    <li className={`progress-nav__item ${bgColor}`}>
      <a aria-disabled={bgColor === "is-disabled"} href={"#"}>
        {props.label}
      </a>
    </li>
  )
}

const ProgressNav = (props: {
  currentPageSection: number
  completedSections: number
  labels: string[]
}) => {
  return (
    <ul className={!OnClientSide() ? "invisible" : "progress-nav"}>
      {props.labels.map((label, i) => (
        <ProgressNavItem
          key={label}
          // Sections are 1-indexed
          section={i + 1}
          currentPageSection={props.currentPageSection}
          completedSections={props.completedSections}
          label={label}
        />
      ))}
    </ul>
  )
}

export { ProgressNav as default, ProgressNav }
