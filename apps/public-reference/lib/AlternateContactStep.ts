import StepDefinition from "./StepDefinition"

export default class AlternateContactStep extends StepDefinition {
  skipStep() {
    return this.conductor.application.alternateContact.type == "noContact"
  }
}
