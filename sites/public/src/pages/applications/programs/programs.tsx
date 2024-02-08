import React from "react"
import ApplicationMultiselectQuestionStep from "../../../components/applications/ApplicationMultiselectQuestionStep"
import { MultiselectQuestionsApplicationSectionEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const ApplicationPrograms = () => {
  return (
    <ApplicationMultiselectQuestionStep
      applicationSection={MultiselectQuestionsApplicationSectionEnum.programs}
      applicationStep={"programs"}
      applicationSectionNumber={3}
    />
  )
}

export default ApplicationPrograms
