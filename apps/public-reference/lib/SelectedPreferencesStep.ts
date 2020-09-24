import StepDefinition from "./StepDefinition"

export default class SelectedPreferencesStep extends StepDefinition {
  skipStep() {
    return !this.conductor.application.preferences.none
  }
}
