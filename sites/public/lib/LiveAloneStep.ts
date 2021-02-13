import StepDefinition from "./StepDefinition"

export default class LiveAloneStep extends StepDefinition {
  skipStep() {
    return this.application.householdSize > 1
  }
}
