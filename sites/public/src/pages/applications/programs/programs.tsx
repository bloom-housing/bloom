import React from "react"
import {
  FeatureFlagEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import ApplicationMultiselectQuestionStep from "../../../components/applications/ApplicationMultiselectQuestionStep"
import { useFormConductor } from "../../../lib/hooks"

const ApplicationPrograms = () => {
  const { conductor } = useFormConductor("programs")

  const swapCommunityTypeWithPrograms = conductor.config.featureFlags?.some(
    (flag) => flag.name === FeatureFlagEnum.swapCommunityTypeWithPrograms && flag.active
  )

  return (
    <ApplicationMultiselectQuestionStep
      applicationSection={MultiselectQuestionsApplicationSectionEnum.programs}
      applicationStep={"programs"}
      applicationSectionNumber={3}
      swapCommunityTypeWithPrograms={swapCommunityTypeWithPrograms}
    />
  )
}

export default ApplicationPrograms
