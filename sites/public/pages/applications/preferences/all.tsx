import React from "react"
import { ApplicationSection } from "@bloom-housing/backend-core/types"
import { t } from "@bloom-housing/ui-components"
import ApplicationMultiselectQuestionStep from "../../../src/ApplicationMultiselectQuestionStep"

const ApplicationPreferencesAll = () => {
  return (
    <ApplicationMultiselectQuestionStep
      applicationSection={ApplicationSection.preferences}
      applicationStep={"preferencesAll"}
      applicationSectionNumber={5}
      strings={{
        title: t("application.preferences.title"),
        subTitle: t("application.preferences.preamble"),
        selectText: t("application.preferences.selectBelow"),
      }}
    />
  )
}

export default ApplicationPreferencesAll
