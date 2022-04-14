import React from "react"
import { useRouter } from "next/router"
import "./ProgressNav.scss"
import { t } from "../helpers/translator"

const ProgressNavItem = (props: {
  section: number
  currentPageSection: number
  completedSections: number
  label: string
  mounted: boolean
  route: string | null
}) => {
  const router = useRouter()

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
    <li className={`progress-nav__item ${bgColor}`}>
      <a
        aria-disabled={bgColor === "is-disabled"}
        href={"#"}
        onClick={(e) => {
          // Prevent default event behavior, which would route using href and not onClick.
          e.preventDefault()
          if (props.route) {
            void router.push(props.route)
          }
        }}
      >
        {srText}
        {props.label}
      </a>
    </li>
  )
}

const ProgressNav = (props: {
  currentPageSection: number
  completedSections: number
  labels: string[]
  mounted: boolean
  routes?: string[]
}) => {
  return (
    <div>
      <h2 className="sr-only">{t("progressNav.srHeading")}</h2>
      <ul className={!props.mounted ? "invisible" : "progress-nav"}>
        {props.labels.map((label, i) => (
          <ProgressNavItem
            key={label}
            // Sections are 1-indexed
            section={i + 1}
            currentPageSection={props.currentPageSection}
            completedSections={props.completedSections}
            label={label}
            mounted={props.mounted}
            route={props.routes ? props.routes[i] : null}
          />
        ))}
      </ul>
    </div>
  )
}

export { ProgressNav as default, ProgressNav }
