import {
  ApplicationSelectionCreate,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import StepDefinition from "./StepDefinition"
import { isFeatureFlagOn } from "../helpers"

export default class ProgramsStep extends StepDefinition {
  skipStep() {
    return (
      isFeatureFlagOn(this.conductor.config, FeatureFlagEnum.swapCommunityTypeWithPrograms) ||
      !this.conductor.listing?.listingMultiselectQuestions.filter(
        (question) => question?.multiselectQuestions?.applicationSection === "programs"
      ).length
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save(formData: any[]) {
    if (formData[0]?.selections) {
      // V2MSQ
      formData.forEach((selection) => {
        this.application.applicationSelections = this.application.applicationSelections.filter(
          (oldSelection: ApplicationSelectionCreate) =>
            oldSelection.multiselectQuestion.id !== selection.multiselectQuestion.id
        )
        if (selection.selections.length > 0) this.application.applicationSelections.push(selection)
      })
    } else {
      // V1MSQ
      this.application.programs = formData
    }
    this.conductor.sync()
  }
}
