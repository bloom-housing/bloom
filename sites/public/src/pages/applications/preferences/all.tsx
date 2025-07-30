import React from "react"
import { t } from "@bloom-housing/ui-components"
import { MultiselectQuestionsApplicationSectionEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { listingSectionQuestions } from "@bloom-housing/shared-helpers"
import ApplicationMultiselectQuestionStep from "../../../components/applications/ApplicationMultiselectQuestionStep"
import { useFormConductor } from "../../../lib/hooks"

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
      swapCommunityTypeWithPrograms={false}
    />
  )
}

export default ApplicationPreferencesAll
