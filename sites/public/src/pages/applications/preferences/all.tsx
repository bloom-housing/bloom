import React from "react"
import { ApplicationSection } from "@bloom-housing/backend-core/types"
import { t } from "@bloom-housing/ui-components"
import ApplicationMultiselectQuestionStep from "../../../components/ApplicationMultiselectQuestionStep"
import { listingSectionQuestions } from "@bloom-housing/shared-helpers"
import { useFormConductor } from "../../../lib/hooks"

const ApplicationPreferencesAll = () => {
  const { listing } = useFormConductor("preferences")

  return (
    <ApplicationMultiselectQuestionStep
      applicationSection={ApplicationSection.preferences}
      applicationStep={"preferencesAll"}
      applicationSectionNumber={
        listingSectionQuestions(listing, ApplicationSection.programs)?.length ? 5 : 4
      }
      strings={{
        title: t("application.preferences.title"),
        subTitle: t("application.preferences.preamble"),
      }}
    />
  )
}

export default ApplicationPreferencesAll
