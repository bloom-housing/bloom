import StepDefinition from "./StepDefinition"

export default class AlternateContactStep extends StepDefinition {
  skipStep() {
    return this.application.alternateContact.type === "noContact"
  }
}
