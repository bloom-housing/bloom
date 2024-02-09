import { ApplicationMultiselectQuestion } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import StepDefinition from "./StepDefinition"

export default class ProgramsStep extends StepDefinition {
  skipStep() {
    return !this.conductor.listing?.listingMultiselectQuestions.filter(
      (question) => question?.multiselectQuestions?.applicationSection === "programs"
    ).length
  }

  save(formData: ApplicationMultiselectQuestion[]) {
    this.application.programs = formData
    this.conductor.sync()
  }
}
