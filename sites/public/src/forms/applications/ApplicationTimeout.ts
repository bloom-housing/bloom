import { createElement, useContext } from "react"
import { IdleTimeout, AuthContext } from "@bloom-housing/shared-helpers"
import { t } from "@bloom-housing/ui-components"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"

const ApplicationTimeout = () => {
  const { profile } = useContext(AuthContext)
  const { conductor } = useContext(AppSubmissionContext)

  const onTimeout = () => {
    conductor.reset()
  }

  // Only return something if the user is not logged in - otherwise we'll let the root logged in user timeout handle
  // things.
  return profile
    ? null
    : createElement(IdleTimeout, {
        promptTitle: t("t.areYouStillWorking"),
        promptText: t("application.timeout.text"),
        promptAction: t("application.timeout.action"),
        redirectPath: "/",
        alertMessage: t("application.timeout.afterMessage"),
        alertType: "alert",
        onTimeout,
      })
}

export { ApplicationTimeout as default, ApplicationTimeout }
