import {
  ApplicationMultiselectQuestion,
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

  save(formData: ApplicationMultiselectQuestion[]) {
    this.application.programs = formData
    this.conductor.sync()
  }
}
