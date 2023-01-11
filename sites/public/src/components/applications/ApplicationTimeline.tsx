import React from "react"
import Markdown from "markdown-to-jsx"
import { t, Icon } from "@bloom-housing/ui-components"
import styles from "./ApplicationTimeline.module.scss"

export interface ApplicationTimelineProps {
  strings?: {
    applicationReceived?: string
    applicationsClosed?: string
    applicationsRanked?: string
  }
}
const ApplicationTimeline = (props: ApplicationTimelineProps) => (
  <ul
    className={`progress-nav ${styles["application-timeline"]}`}
    aria-label="Steps of processing your application"
  >
    <li className={`${styles["progress-nav__dot-item"]} is-active`} aria-current="step">
      <span className={`text-white ${styles["absolute"]}`}>
        <Icon symbol="check" size="base" />
      </span>
      <Markdown className="font-bold" options={{ disableParsingRawHTML: true }}>
        {props.strings?.applicationReceived ??
          t("application.review.confirmation.applicationReceived")}
      </Markdown>
    </li>
    <li className={`${styles["progress-nav__dot-item"]} is-disabled`}>
      <Markdown options={{ disableParsingRawHTML: true }}>
        {props.strings?.applicationsClosed ??
          t("application.review.confirmation.applicationsClosed")}
      </Markdown>
    </li>
    <li className={`${styles["progress-nav__dot-item"]} is-disabled`}>
      <Markdown options={{ disableParsingRawHTML: true }}>
        {props.strings?.applicationsRanked ??
          t("application.review.confirmation.applicationsRanked")}
      </Markdown>
    </li>
  </ul>
)

export { ApplicationTimeline }
