import React from "react"
import Markdown from "markdown-to-jsx"
import { t } from "@bloom-housing/ui-components"
import { Icon } from "../icons/Icon"
import "./ApplicationTimeline.scss"

export interface ApplicationTimelineProps {
  strings?: {
    applicationReceived?: string
    applicationsClosed?: string
    applicationsRanked?: string
  }
}
const ApplicationTimeline = (props: ApplicationTimelineProps) => (
  <ul
    className="progress-nav application-timeline"
    aria-label="Steps of processing your application"
  >
    <li className="progress-nav__dot-item is-active" aria-current="step">
      <span className="text-white absolute">
        <Icon symbol="check" size="base" />
      </span>
      <Markdown className="font-bold" options={{ disableParsingRawHTML: true }}>
        {props.strings?.applicationReceived ??
          t("application.review.confirmation.applicationReceived")}
      </Markdown>
    </li>
    <li className="progress-nav__dot-item is-disabled">
      <Markdown options={{ disableParsingRawHTML: true }}>
        {props.strings?.applicationsClosed ??
          t("application.review.confirmation.applicationsClosed")}
      </Markdown>
    </li>
    <li className="progress-nav__dot-item is-disabled">
      <Markdown options={{ disableParsingRawHTML: true }}>
        {props.strings?.applicationsRanked ??
          t("application.review.confirmation.applicationsRanked")}
      </Markdown>
    </li>
  </ul>
)

export { ApplicationTimeline }
