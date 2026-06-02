import React from "react"
import {
  FeatureFlagEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import ApplicationMultiselectQuestionStep from "../../../components/applications/ApplicationMultiselectQuestionStep"
import { isFeatureFlagOn } from "../../../lib/helpers"
import { useFormConductor } from "../../../lib/hooks"

const ApplicationPrograms = () => {
  const { conductor } = useFormConductor("programs")

  const swapCommunityTypeWithPrograms = isFeatureFlagOn(
    conductor.config,
    FeatureFlagEnum.swapCommunityTypeWithPrograms
  )

  const enableV2MSQ = isFeatureFlagOn(conductor.config, FeatureFlagEnum.enableV2MSQ)

  return (
    <ApplicationMultiselectQuestionStep
      applicationSection={MultiselectQuestionsApplicationSectionEnum.programs}
      applicationStep={"programs"}
      applicationSectionNumber={3}
      swapCommunityTypeWithPrograms={swapCommunityTypeWithPrograms}
      enableV2MSQ={enableV2MSQ}
    />
  )
}

export default ApplicationPrograms
