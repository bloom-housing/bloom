import StepDefinition from "./StepDefinition"

export default class HouseholdMemberStep extends StepDefinition {
  skipStep() {
    return this.application.householdSize === 1
  }
}
