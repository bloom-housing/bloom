import StepDefinition from "./StepDefinition"

export default class AlternateContactTypeStep extends StepDefinition {
  skipStep() {
    if (this.conductor.config?.isAdvocate) {
      this.application.alternateContact = {
        ...this.application.alternateContact,
        type: "caseManager",
      }
      return true
    }
    return false
  }
}
