import React from "react"
import { ApplicationSection } from "@bloom-housing/backend-core/types"
import ApplicationMultiselectQuestionStep from "../../../src/ApplicationMultiselectQuestionStep"

const ApplicationPreferencesAll = () => {
  return (
    <ApplicationMultiselectQuestionStep
      applicationSection={ApplicationSection.preferences}
      applicationStep={"preferencesAll"}
      applicationSectionNumber={5}
    />
  )
}

export default ApplicationPreferencesAll
