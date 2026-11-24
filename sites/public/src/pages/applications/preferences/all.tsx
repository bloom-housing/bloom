import React from "react"
import { listingSectionQuestions } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import ApplicationMultiselectQuestionStep from "../../../components/applications/ApplicationMultiselectQuestionStep"
import { ApplicationPreviewBanner } from "../../../components/applications/ApplicationPreviewBanner"
import { isFeatureFlagOn } from "../../../lib/helpers"
import { useFormConductor } from "../../../lib/hooks"
import { sharedGetStaticProps } from "../../../lib/sharedPageProps"

const ApplicationPreferencesAll = () => {
  const { conductor, listing } = useFormConductor("preferences")

  const enableV2MSQ = isFeatureFlagOn(conductor.config, FeatureFlagEnum.enableV2MSQ)

  return (
    <>
      {conductor.config.isPreview && <ApplicationPreviewBanner />}
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
    </>
  )
}

export default ApplicationPreferencesAll

export const getStaticProps = sharedGetStaticProps
