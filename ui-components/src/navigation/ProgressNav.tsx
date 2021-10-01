import React from "react"
import { useRouter } from "next/router"
import { OnClientSide } from "../helpers/nextjs"
import "./ProgressNav.scss"
import { t } from "../helpers/translator"

const ProgressNavItem = (props: {
  section: number
  currentPageSection: number
  completedSections: number
  label: string
  route: string | null
}) => {
  const router = useRouter()

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
      <a
        aria-disabled={bgColor == "is-disabled"}
        href={"#"}
        onClick={(e) => {
          // Prevent default event behavior, which would route using href and not onClick.
          e.preventDefault()
          if (props.route) {
            void router.push(props.route)
          }
        }}
      >
        {props.label}
      </a>
    </li>
  )
}

const ProgressNav = (props: {
  currentPageSection: number
  completedSections: number
  labels: string[]
  routes?: string[]
}) => {
  return (
    <div>
      <h2 className="sr-only">{t("progressNav.srHeading")}</h2>
      <ul className={!OnClientSide() ? "invisible" : "progress-nav"}>
        {props.labels.map((label, i) => (
          <ProgressNavItem
            key={label}
            // Sections are 1-indexed
            section={i + 1}
            currentPageSection={props.currentPageSection}
            completedSections={props.completedSections}
            label={label}
            route={props.routes ? props.routes[i] : null}
          />
        ))}
      </ul>
    </div>
  )
}

export { ProgressNav as default, ProgressNav }
