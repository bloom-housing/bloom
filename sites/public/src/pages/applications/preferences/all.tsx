import React from "react"
import { t } from "@bloom-housing/ui-components"
import ApplicationMultiselectQuestionStep from "../../../components/applications/ApplicationMultiselectQuestionStep"
import { listingSectionQuestions } from "@bloom-housing/shared-helpers"
import { useFormConductor } from "../../../lib/hooks"
import { MultiselectQuestionsApplicationSectionEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const ApplicationPreferencesAll = () => {
  const { listing } = useFormConductor("preferences")

  return (
    <ApplicationMultiselectQuestionStep
      applicationSection={MultiselectQuestionsApplicationSectionEnum.preferences}
      applicationStep={"preferencesAll"}
      applicationSectionNumber={
        listingSectionQuestions(listing, MultiselectQuestionsApplicationSectionEnum.programs)
          ?.length
          ? 5
          : 4
      }
      strings={{
        title: t("application.preferences.title"),
        subTitle: t("application.preferences.preamble"),
      }}
    />
  )
}

export default ApplicationPreferencesAll
