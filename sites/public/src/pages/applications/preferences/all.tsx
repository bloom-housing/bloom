import React from "react"
import { t } from "@bloom-housing/ui-components"
import {
  FeatureFlagEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { listingSectionQuestions } from "@bloom-housing/shared-helpers"
import ApplicationMultiselectQuestionStep from "../../../components/applications/ApplicationMultiselectQuestionStep"
import { isFeatureFlagOn } from "../../../lib/helpers"
import { useFormConductor } from "../../../lib/hooks"

const ApplicationPreferencesAll = () => {
  const { conductor, listing } = useFormConductor("preferences")

  const enableV2MSQ = isFeatureFlagOn(conductor.config, FeatureFlagEnum.enableV2MSQ)

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
      enableV2MSQ={enableV2MSQ}
    />
  )
}

export default ApplicationPreferencesAll
