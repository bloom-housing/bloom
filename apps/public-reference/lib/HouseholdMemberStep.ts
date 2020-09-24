import StepDefinition from "./StepDefinition"

export default class HouseholdMemberStep extends StepDefinition {
  skipStep() {
    return this.conductor.application.householdSize === 1
  }
}
