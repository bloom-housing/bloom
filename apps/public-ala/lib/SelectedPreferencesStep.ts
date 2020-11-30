import StepDefinition from "./StepDefinition"

export default class SelectedPreferencesStep extends StepDefinition {
  skipStep() {
    return !this.application.preferences.none
  }
}
