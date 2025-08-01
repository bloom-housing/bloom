import React from "react"
import ApplicationMultiselectQuestionStep from "../../../components/applications/ApplicationMultiselectQuestionStep"
import { MultiselectQuestionsApplicationSectionEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const ApplicationCommunityTypes = () => {
  return (
    <ApplicationMultiselectQuestionStep
      applicationSection={MultiselectQuestionsApplicationSectionEnum.programs}
      applicationStep={"communityTypes"}
      applicationSectionNumber={3}
      swapCommunityTypeWithPrograms={true}
    />
  )
}

export default ApplicationCommunityTypes
