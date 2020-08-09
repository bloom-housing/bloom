import { createElement, useContext } from "react"
import { IdleTimeout, UserContext, t } from "@bloom-housing/ui-components"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"

const ApplicationTimeout = () => {
  const { profile } = useContext(UserContext)
  const { conductor } = useContext(AppSubmissionContext)

  const onTimeout = () => {
    conductor.reset()
  }

  // Only return something if the user is not logged in - otherwise we'll let the root logged in user timeout handle
  // things.
  return profile
    ? null
    : createElement(IdleTimeout, {
        promptTitle: t("application.timeout.title"),
        promptText: t("application.timeout.text"),
        promptAction: t("application.timeout.action"),
        redirectPath: `/?alert=${encodeURIComponent(t("application.timeout.afterMessage"))}`,
        onTimeout,
      })
}

export { ApplicationTimeout as default, ApplicationTimeout }
