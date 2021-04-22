import StepDefinition from "./StepDefinition"

export default class PreferencesStep extends StepDefinition {
  skipStep() {
    return !this.conductor.listing.preferences.length
  }
}
