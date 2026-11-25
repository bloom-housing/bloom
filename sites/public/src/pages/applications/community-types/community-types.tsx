import React from "react"
import ApplicationMultiselectQuestionStep from "../../../components/applications/ApplicationMultiselectQuestionStep"
import {
  FeatureFlagEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ApplicationPreviewBanner } from "../../../components/applications/ApplicationPreviewBanner"
import { isFeatureFlagOn } from "../../../lib/helpers"
import { useFormConductor } from "../../../lib/hooks"
import { sharedGetStaticProps } from "../../../lib/sharedPageProps"

const ApplicationCommunityTypes = () => {
  const { conductor } = useFormConductor("preferences")

  const enableV2MSQ = isFeatureFlagOn(conductor.config, FeatureFlagEnum.enableV2MSQ)

  return (
    <>
      {conductor.config.isPreview && <ApplicationPreviewBanner />}
      <ApplicationMultiselectQuestionStep
        applicationSection={MultiselectQuestionsApplicationSectionEnum.programs}
        applicationStep={"communityTypes"}
        applicationSectionNumber={3}
        swapCommunityTypeWithPrograms={true}
        enableV2MSQ={enableV2MSQ}
      />
    </>
  )
}

export default ApplicationCommunityTypes

export const getStaticProps = sharedGetStaticProps
