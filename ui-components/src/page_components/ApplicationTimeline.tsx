import React from "react"
import Markdown from "markdown-to-jsx"
import { Icon } from "../icons/Icon"
import { t } from "../helpers/translator"
import "./ApplicationTimeline.scss"

const ApplicationTimeline = () => (
  <ul className="progress-nav application-timeline">
    <li className="progress-nav__item is-active">
      <span className="text-white absolute">
        <Icon symbol="check" size="base" />
      </span>
      <Markdown className="font-bold" options={{ disableParsingRawHTML: true }}>
        {t("application.review.confirmation.applicationReceived")}
      </Markdown>
    </li>
    <li className="progress-nav__item is-disabled">
      <Markdown options={{ disableParsingRawHTML: true }}>
        {t("application.review.confirmation.applicationsClosed")}
      </Markdown>
    </li>
    <li className="progress-nav__item is-disabled">
      <Markdown options={{ disableParsingRawHTML: true }}>
        {t("application.review.confirmation.applicationsRanked")}
      </Markdown>
    </li>
  </ul>
)

export { ApplicationTimeline }
